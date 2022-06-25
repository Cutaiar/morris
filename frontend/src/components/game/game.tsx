import React from "react";

// State
// import { Player, useGameState } from "../../hooks/useGameState";

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
} from "..";

// Hooks
import { useDebug, usePrefs, useSocketGameState } from "../../hooks";
import { useMount } from "react-use";

// Style
import { palette } from "../../theme";

export const Game = () => {
  // TODO: Don't use online state all the time, just when online mode is true
  // const [gameState, updateGameState] = useGameState();
  const [gameState, updateGameState, player] = useSocketGameState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debug, _, syncDebug] = useDebug();
  useMount(() => syncDebug());

  // If advanced controls are open or not
  const [isAdvanced, setIsAdvanced] = React.useState(false);

  // Whether the opponent is controlled by the keyboard or not
  const [opponentType, setOpponentType] = React.useState<
    OpponentType | undefined
  >(undefined);

  const [prefs, setPref] = usePrefs();
  const mute = prefs.mute;
  const setMute = (mute: boolean) => setPref("mute", mute);
  const name = prefs.name ?? "Me";

  return (
    <div className="App">
      <TopNav />
      <div className="Page">
        <div className="Controls">
          {!opponentType && <OpponentSelector onDecision={setOpponentType} />}
          {opponentType && (
            <PlayerCard
              player={player === "a" ? "b" : "a"}
              remove={gameState.turn.type === "remove"}
              turn={gameState.turn.player}
              name="Opponent"
              remainingMen={player ? gameState.remainingMen[player] : 0}
            />
          )}
          {opponentType === "ai" && (
            <Opponent
              state={gameState}
              player={"b"}
              updateGameState={updateGameState}
              sound={!mute}
            />
          )}
          {opponentType === "local" && (
            <label style={{ fontSize: "medium", color: palette.neutral }}>
              opponent is local
            </label>
          )}
        </div>

        {/* We need to use the adjacency in gameState to assign ids to the elements drawn by this component */}
        <Board
          gameState={gameState}
          onPlay={(play) => {
            updateGameState(play);
          }}
          sound={!mute}
          disabled={
            // Disable the board if the opponent is online or ai and it's not their turn
            opponentType !== "local" && player !== gameState.turn.player
          }
        />

        <div className="Controls">
          <PlayerCard
            player={player}
            remove={gameState.turn.type === "remove"}
            turn={gameState.turn.player}
            name={name}
            remainingMen={player ? gameState.remainingMen[player] : 0}
          />

          <span
            style={{
              fontSize: "medium",
              textDecoration: "underline",
              color: palette.neutral,
            }}
            onClick={() => setIsAdvanced((prev) => !prev)}
          >
            Advanced
          </span>
          {isAdvanced && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label
                style={{ fontSize: "medium" }}
              >{`phase: ${gameState.phase}`}</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  id={"opponentControlled"}
                  type={"checkbox"}
                  checked={opponentType === "local"}
                  onChange={(e) =>
                    setOpponentType(e.target.checked ? "local" : "ai")
                  }
                />
                <label
                  style={{ fontSize: "medium" }}
                  htmlFor="opponentControlled"
                >
                  control opponent
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  id={"mute"}
                  type={"checkbox"}
                  checked={mute}
                  onChange={(e) => setMute(e.target.checked)}
                />
                <label style={{ fontSize: "medium" }} htmlFor="mute">
                  mute
                </label>
                {/* TODO: Disable motion toggle */}
              </div>

              <Button onClick={() => updateGameState({ type: "reset" })}>
                Reset
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
        </div>

        {/* Show raw Game State for debug */}
        {debug && <DebugGameState gameState={gameState} />}
      </div>
      {/* If there is a winner, show the modal, the game is over */}
      {gameState.winner && (
        <WinnerModal
          onPlayAgain={() => updateGameState({ type: "reset" })}
          winner={gameState.winner}
        />
      )}
    </div>
  );
};
