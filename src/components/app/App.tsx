import React from "react";
import "./App.css";
import { palette } from "../../theme";

import { Board } from "../board";
import { useGameState } from "../../hooks/useGameState";
import { RemainingMen } from "../RemainingMen/RemainingMen";

import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { confetti } from "../../theme/theme";

import GithubCorner from "react-github-corner";

import { useDebug } from "../../hooks/useDebug";
import { useMount } from "react-use";
import { Opponent } from "../opponent/opponent";

// TODO: Move to utils or something
const openInNewTab = { target: "_blank", rel: "noopener noreferrer" };

export const App: React.FC = () => {
  const [gameState, updateGameState] = useGameState();

  const { width, height } = useWindowSize();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debug, _, syncDebug] = useDebug();
  useMount(() => syncDebug());

  // Whether the game is muted or not
  const [mute, setMute] = React.useState(false);

  // Whether the opponent is controlled by the keyboard or not
  const [opponentControlled, setOpponentControlled] = React.useState(false);

  return (
    <>
      {gameState.winner && (
        <>
          <Confetti
            width={width}
            height={height}
            colors={
              gameState.winner === "a" ? confetti.primary : confetti.secondary
            }
          />
          <div
            style={{
              position: "absolute",
              width: "100vw",
              height: "100vh",
              background: "transparent",
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: 800,
                height: 200,
                borderRadius: 10,
                backgroundColor:
                  gameState.winner === "a"
                    ? palette.primary
                    : palette.secondary,
              }}
              className="fade-in"
            >
              <h1>{`${gameState.winner} wins.`}</h1>
              <button
                style={{
                  minWidth: 60,
                  minHeight: 30,
                  backgroundColor: palette.neutralLight,
                  color: palette.neutralDark,
                  borderRadius: 5,
                  borderStyle: "none",
                }}
                onClick={() => updateGameState({ type: "reset" })}
              >
                Play again
              </button>
            </div>
          </div>
        </>
      )}
      <GithubCorner
        href="https://github.com/Cutaiar/morris"
        bannerColor={palette.neutral}
        octoColor={palette.background}
        size={80}
        direction="right"
        {...openInNewTab}
      />
      <div className="App">
        {/* We need to use the adjacency in gameState to assign ids to the elements drawn by this component */}
        <Board
          gameState={gameState}
          onPlay={(play) => {
            updateGameState(play);
          }}
          sound={!mute}
        />

        <div className="Controls">
          {/* Temporarily adding a slider to control the number of rings */}
          {/* <Slider
      min={minRings}
      max={maxRings}
      value={ringCount}
      onChange={(e) => setRingCount(Number(e.target.value))}
      ringCount={ringCount}
    /> */}

          <label style={{ color: palette.neutral, fontSize: "larger" }}>
            6 Man Morris
          </label>

          <label
            style={{ fontSize: "medium" }}
          >{`phase: ${gameState.phase}`}</label>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "medium",
              gap: 10,
            }}
          >
            <label>{"player: "}</label>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background:
                  gameState.turn.player === "a"
                    ? palette.primary
                    : palette.secondary,
              }}
            />
            {gameState.turn.type === "remove" && <i>{" (to remove)"}</i>}
          </div>

          <label style={{ fontSize: "medium" }}>remaining men:</label>
          <RemainingMen
            remainingMenCount={gameState.remainingMen.a}
            player={"a"}
          />
          <RemainingMen
            remainingMenCount={gameState.remainingMen.b}
            player={"b"}
          />
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
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              id={"opponentControlled"}
              type={"checkbox"}
              checked={opponentControlled}
              onChange={(e) => setOpponentControlled(e.target.checked)}
            />
            <label style={{ fontSize: "medium" }} htmlFor="opponentControlled">
              control opponent
            </label>
          </div>
          {!opponentControlled ? (
            <Opponent
              state={gameState}
              player={"b"}
              updateGameState={updateGameState}
              sound={!mute}
            />
          ) : (
            <label style={{ fontSize: "medium" }}>opponent is controlled</label>
          )}

          {/* Temporarily add reset button for testing */}
          <button
            style={{
              minWidth: 60,
              minHeight: 30,
              backgroundColor: palette.primary,
              color: palette.neutralLight,
              borderRadius: 5,
              borderStyle: "none",
            }}
            onClick={() => updateGameState({ type: "reset" })}
          >
            Reset
          </button>
        </div>

        {/* Show raw Game State for debug */}
        {debug && (
          <div
            style={{
              height: "100%",
              overflow: "auto",
              position: "absolute",
              top: 0,
              left: 20,
            }}
          >
            <label>Game State</label>
            <p
              style={{
                fontSize: "small",
                whiteSpace: "pre-wrap",
              }}
            >
              {JSON.stringify(gameState, null, 4)}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
