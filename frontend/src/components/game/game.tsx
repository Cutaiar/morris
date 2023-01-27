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
  Loader,
} from "components";

// Hooks
import {
  useDebug,
  useMultiplayer,
  usePrefs,
  useSocketGameState,
  useGameState,
} from "hooks";
import { useMount } from "react-use";

// Style
import { palette } from "theme";
import styled from "styled-components";

// TODO this should import from somewhere else
import { Player } from "hooks/useGameState";
import { OpponentDifficulty } from "hooks/useOpponent";

const defaultOpponentName = "Opponent";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debug, setDebug, syncDebug] = useDebug();
  useMount(() => syncDebug());

  // If advanced controls are open or not
  const [isAdvanced, setIsAdvanced] = React.useState(false);

  // Whether the opponent is controlled by the keyboard or not
  const [opponentType, setOpponentType] = React.useState<
    OpponentType | undefined
  >(undefined);

  const [player, setPlayer] = React.useState<Player | undefined>(undefined);
  const [opponent, setOpponent] = React.useState<Player | undefined>(undefined);
  const [opponentName, setOpponentName] = React.useState<string | undefined>(
    undefined
  );
  // Difficulty of the opponent. Player can change this mid game currently
  const [oppDifficulty, setOppDifficulty] =
    React.useState<OpponentDifficulty>("easy");

  const [prefs, setPref, resetPrefs] = usePrefs();
  const mute = prefs.mute;
  const motion = prefs.motion;
  const setMotion = (motion: boolean) => setPref("motion", motion);
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
  const handleOpponentSelected = async (type: OpponentType) => {
    if (type === "online") {
      setOpponentType(type);
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
    setOpponentType(type);
    setOpponentName(defaultOpponentName);
    setOpponent("b");
    setPlayer("a");
  };

  return (
    <AppContainer>
      <TopNav />
      <Page>
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
          {opponent && opponentType === "ai" && (
            <>
              <Opponent
                state={gameState}
                player={opponent}
                updateGameState={updateGameState}
                sound={!mute}
                difficulty={oppDifficulty}
              />
              <Button
                onClick={() =>
                  setOppDifficulty(
                    oppDifficulty === "medium" ? "easy" : "medium"
                  )
                }
              >
                {oppDifficulty}
              </Button>
            </>
          )}
          {opponentType === "local" && (
            <label style={{ fontSize: "medium", color: palette.neutral }}>
              opponent is local
            </label>
          )}
        </Controls>

        {/* We need to use the adjacency in gameState to assign ids to the elements drawn by this component */}
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
                  style={{ fontSize: "medium" }}
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
                  checked={motion ?? false}
                  onChange={setMotion}
                />

                <Toggle label={"Debug"} checked={debug} onChange={setDebug} />

                <Button onClick={() => updateGameState({ type: "reset" })}>
                  Reset Game
                </Button>

                <Button onClick={() => resetPrefs()}>Reset Prefs</Button>
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

        {/* Show raw Game State for debug */}
        {debug && <DebugGameState gameState={gameState} />}
      </Page>
      {/* If there is a winner, show the modal, the game is over */}
      {gameState.winner && (
        <WinnerModal
          onPlayAgain={() => updateGameState({ type: "reset" })}
          winner={gameState.winner}
        />
      )}
    </AppContainer>
  );
};

/**
 * A simple toggle component
 */
const Toggle = (props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        id={props.label}
        type={"checkbox"}
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />
      <label style={{ fontSize: "medium" }} htmlFor={props.label}>
        {props.label}
      </label>
    </div>
  );
};

/** Take viewport height and layout full-width rows */
const AppContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 100vh;
`;

/** Set the background, layout full height rows*/
const Page = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: ${({ theme }) => theme.palette.neutralLight};
  gap: 20px;
  width: 100%;
  flex: 1;
  padding-top: 100px;
  padding-bottom: 100px;
`;

/** Hold the playerCard */
const Controls = styled.div`
  background-color: ${({ theme }) => theme.palette.neutralDark};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  height: fit-content;
  width: fit-content;
  padding: 20px;
  border-radius: 10px;
`;
