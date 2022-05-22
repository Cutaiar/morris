import React from "react";
import "./App.css";
import { palette } from "../../theme";

import { Board } from "../board";
import { useGameState } from "../../hooks/useGameState";
import { RemainingMen } from "../RemainingMen/RemainingMen";

export const App: React.FC = () => {
  const [gameState, updateGameState] = useGameState();

  return (
    <div className="App">
      {/* We need to use the adjacency in gameState to assign ids to the elements drawn by this component */}
      <Board
        gameState={gameState}
        onPlay={(play) => {
          updateGameState(play);
        }}
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

        <label style={{ color: palette.primary, fontSize: "larger" }}>
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
        </div>

        <label style={{ fontSize: "medium" }}>Remaining men:</label>
        <RemainingMen
          remainingMenCount={gameState.remainingMen.a}
          player={"a"}
        />
        <RemainingMen
          remainingMenCount={gameState.remainingMen.b}
          player={"b"}
        />

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

        <a
          href="https://github.com/Cutaiar/morris"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: palette.primary, fontSize: "medium" }}
        >
          github
        </a>
      </div>

      {/* Show raw Game State for debug */}
      {window.location.search.includes("debug") && (
        <div
          style={{
            height: "100%",
            overflow: "auto",
            position: "absolute",
            top: 0,
            right: 20,
          }}
        >
          <label>Game State</label>
          <p
            style={{
              fontSize: "small",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(gameState, null, 2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
