import { useState } from "react";
import styled from "styled-components";

// Components
import {
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
  IconButton
} from "components";

// Hooks
import {
  useDebug,
  useMultiplayer,
  usePrefs,
  useSocketGameState,
  useGameState,
  useBuildSkipPhaseOneFunc
} from "hooks";
import { useMount } from "react-use";

// Core
import { AIID } from "morris-ai";
import { Player } from "morris-core";
import { Slider } from "components/Slider";

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
  const [isAdvanced, setIsAdvanced] = useState(false);

  /** The local users player (always "a") */
  const [player, setPlayer] = useState<Player>();
  /** The opponents player (always "b") */
  const [opponent, setOpponent] = useState<Player>();
  /** The type of opponent the user is playing against*/
  const [opponentType, setOpponentType] = useState<OpponentType>();
  /** Which AI is the player playing against */
  const [oppAI, setOppAI] = useState<AIID>();
  /** Display name for the opponent */
  const [opponentName, setOpponentName] = useState<string>();
  const [opponentSpeed, setOpponentSpeed] = useState<number>(1000);

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

  const [connecting, setConnecting] = useState(false);
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
                speed={opponentSpeed}
                player={opponent}
                updateGameState={updateGameState}
                sound={!mute}
                ai={oppAI}
              />
            )}
            {opponentType === "local" && (
              <OpponentLabel>opponent is local</OpponentLabel>
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
                (opponentType !== "local" &&
                  player !== gameState.turn.player) ||
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
                  name: "Settings",
                  tooltip: "Settings and advanced",
                  onClick: () => setIsAdvanced((prev) => !prev)
                }
              ]}
            >
              {isAdvanced && (
                <AdvancedMenu>
                  <code>{`phase: ${gameState.phase}`}</code>
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
                  <Slider
                    min={1}
                    max={1000}
                    value={opponentSpeed}
                    onChange={(e) => setOpponentSpeed(Number(e.target.value))}
                    suffix={(v) => {
                      return v === 1 ? "instant" : `${v} ms`;
                    }}
                    label="opponent speed"
                  />
                  <IconButton
                    onClick={() => updateGameState({ type: "reset" })}
                    text="Reset Game"
                    name="RefreshCcw"
                  />
                  <IconButton
                    onClick={() => resetPrefs()}
                    text="Reset Prefs"
                    name="RefreshCcw"
                  />
                  <IconButton
                    onClick={() => skipPhaseOne()}
                    disabled={!opponent}
                    text="Skip Phase 1"
                    name="SkipForward"
                  />
                </AdvancedMenu>
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

const OpponentLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.palette.neutral};
`;

const AdvancedMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BoardContainer = styled.div`
  max-width: 400px;
  width: 100%;
`;

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
`;

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
  width: fit-content;
  min-width: 200px;
  max-width: 400px;
  padding: 24px;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral};
  box-shadow: var(--shadow-elevation-medium);
`;
