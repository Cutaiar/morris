import React from "react";

// Components
import {
  Button,
  PlayerCard,
  WinnerModal,
  DebugGameState,
  TopNav,
  Opponent,
  Board,
  OpponentSelector,
  OpponentType,
  Decision,
  Loader,
  Toggle,
} from "components";

// Hooks
import {
  useDebug,
  useMultiplayer,
  usePrefs,
  useSocketGameState,
  useGameState,
  useBuildSkipPhaseOneFunc,
} from "hooks";
import { useMount } from "react-use";

// Style
import { fontSizes, palette } from "theme";
import styled from "styled-components";

// Core
import { AIID } from "morris-ai";
import { Player } from "morris-core";

/** The root of morris gameplay. Should be wrapped in required providers and placed in the `App` component. */
export const Game = () => {
  // TODO: Figure out how to switch between online state and non-online state
  const [socketGameState, updateSocketGameState] = useSocketGameState();
  const [localGameState, updateLocalGameState] = useGameState();

  // Get multiplayer functionalities
  const [connect] = useMultiplayer((opponentInfo) => {
    console.log("opponent connected");
    setOpponentName(opponentInfo.name ?? "Anonymous Opp.");
    setOpponent(opponentInfo.player);
  });

  /** Debug hook */
  const [debug, setDebug, syncDebug] = useDebug();
  useMount(() => syncDebug());

  /**  If advanced controls are open or not */
  const [isAdvanced, setIsAdvanced] = React.useState(false);

  /** The local users player (always "a") */
  const [player, setPlayer] = React.useState<Player>();
  /** The opponents player (always "b") */
  const [opponent, setOpponent] = React.useState<Player>();
  /** The type of opponent the user is playing against*/
  const [opponentType, setOpponentType] = React.useState<OpponentType>();
  /** Which AI is the player playing against */
  const [oppAI, setOppAI] = React.useState<AIID>();
  /** Display name for the opponent */
  const [opponentName, setOpponentName] = React.useState<string>();

  /** Prefs related setup */
  const [prefs, setPref, resetPrefs] = usePrefs();
  const mute = prefs.mute;
  const reduceMotion = prefs.reduceMotion;
  const setReduceMotion = (motion: boolean) => setPref("reduceMotion", motion);
  const setMute = (mute: boolean) => setPref("mute", mute);
  const name = prefs.name ?? "Me";

  // Online related construction
  // - tell socket context to connect
  // - TODO: Somehow use networked game state rather than local game state (just keep both for now)
  // - set the player when the player event comes back
  // const player = opponentType === "online" ? playerFromSocket : "a";
  const gameState =
    opponentType === "online" ? socketGameState : localGameState;
  const updateGameState =
    opponentType === "online" ? updateSocketGameState : updateLocalGameState;

  const [connecting, setConnecting] = React.useState(false);
  const handleOpponentSelected = async (decision: Decision) => {
    if (decision.type === "online") {
      setOpponentType(decision.type);
      if (!connecting) {
        console.log("connecting");
        setConnecting(true);
        const player = await connect(name);
        setPlayer(player);
        setConnecting(false);
        return;
      }
      return;
    }

    if (decision.type === "local") {
      setOpponentType(decision.type);
      setOpponentName(decision.opponent);
      setOpponent("b");
      setPlayer("a");
      return;
      // TODO: Playing this local opponent should track the result of their game
    }

    // Otherwise, opponent is ai.
    setOpponentType(decision.type);
    setOpponentName(decision.ai);
    setOppAI(decision.ai);
    setOpponent("b");
    setPlayer("a");
  };

  const skipPhaseOne = useBuildSkipPhaseOneFunc(updateGameState);

  return (
    <AppContainer>
      <TopNav />
      <Main>
        <GameContainer>
          {/* Controls for the opponents side */}
          <Controls>
            {!opponentType && (
              <OpponentSelector onDecision={handleOpponentSelected} />
            )}
            {opponentType && (
              <PlayerCard
                player={opponent}
                remove={gameState.turn.type === "remove"}
                turn={gameState.turn.player}
                name={opponentName ?? "..."}
                remainingMen={
                  opponent ? gameState.remainingMen[opponent] : undefined
                }
              />
            )}
            {((opponentType === "online" && !opponent) || connecting) && (
              <Loader text="waiting for opponent..." />
            )}
            {opponent && opponentType === "ai" && oppAI && (
              <Opponent
                state={gameState}
                player={opponent}
                updateGameState={updateGameState}
                sound={!mute}
                ai={oppAI}
              />
            )}
            {opponentType === "local" && (
              <label style={{ fontSize: fontSizes.medium, color: palette.neutral }}>
                opponent is local
              </label>
            )}
          </Controls>

          {/* We need to use the adjacency in gameState to assign ids to the elements drawn by this component */}
          <BoardContainer>
            <Board
              gameState={gameState}
              onPlay={(play) => {
                updateGameState(play);
              }}
              sound={!mute}
              disabled={
                // Disable the board if the opponent is online or ai and it's not their turn, or if there is no opponent
                (opponentType !== "local" && player !== gameState.turn.player) ||
                !opponent
              }
            />
          </BoardContainer>

          {/* Controls for the player side */}
          <Controls>
            <PlayerCard
              player={player}
              local
              remove={gameState.turn.type === "remove"}
              turn={gameState.turn.player}
              name={name}
              onNameChange={(newName) => setPref("name", newName)}
              remainingMen={player ? gameState.remainingMen[player] : undefined}
              toolbarIcons={[
                {
                  name: "settings",
                  tooltip: "Settings and advanced",
                  onClick: () => setIsAdvanced((prev) => !prev),
                },
              ]}
            >
              {isAdvanced && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <label
                    style={{ fontSize: fontSizes.medium }}
                  >{`phase: ${gameState.phase}`}</label>

                  <Toggle
                    checked={opponentType === "local"}
                    onChange={(c) => setOpponentType(c ? "local" : "ai")}
                    label={"Control opponent"}
                  />
                  <Toggle
                    label={"Mute"}
                    checked={mute ?? false}
                    onChange={setMute}
                  />
                  <Toggle
                    label={"Reduce motion"}
                    checked={reduceMotion ?? false}
                    onChange={setReduceMotion}
                  />

                  <Toggle label={"Debug"} checked={debug} onChange={setDebug} />

                  <Button onClick={() => updateGameState({ type: "reset" })}>
                    Reset Game
                  </Button>

                  <Button onClick={() => resetPrefs()}>Reset Prefs</Button>

                  <Button disabled={!opponent} onClick={() => skipPhaseOne()}>
                    Skip phase 1
                  </Button>

                  {/* Temporarily adding a slider to control the number of rings */}
                  {/* <Slider
                min={minRings}
                max={maxRings}
                value={ringCount}
                onChange={(e) => setRingCount(Number(e.target.value))}
                ringCount={ringCount}
              /> */}
                </div>
              )}
            </PlayerCard>
          </Controls>
        </GameContainer>

        {/* Show raw Game State for debug */}
        {debug && <DebugGameState gameState={gameState} />}
      </Main>
      {/* If there is a winner, show the modal, the game is over */}
      {gameState.winner && (
        <WinnerModal
          onPlayAgain={() => updateGameState({ type: "reset" })}
          winner={gameState.winner}
          winnerName={gameState.winner === "a" ? name : opponentName ?? ""}
        />
      )}
    </AppContainer>
  );
};

const BoardContainer = styled.div`
  max-width: 400px;
  width: 100%;
`
/** Take viewport height and layout full-width rows */
const AppContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 100vh;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  gap: 24px;

  /* Goto col layout at 800px screen width */
  /* TODO: kinda hacky to have this media query in both divs. */
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`
/** Set the background, layout full height rows*/
const Main = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.neutralLight};
  gap: 24px;
  width: 100%;
  flex: 1;
  padding: 24px;

  /* Goto col layout at 800px screen width */
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

/** Hold the playerCard */
const Controls = styled.div`
  background-color: ${({ theme }) => theme.palette.surface};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  height: fit-content;
  width: fit-content;
  padding: 24px;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral};
  box-shadow: var(--shadow-elevation-medium);
`;