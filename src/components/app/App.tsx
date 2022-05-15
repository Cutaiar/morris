import React from "react";
import "./App.css";
import { palette } from "../../theme";

import { Board, maxRings, minRings, ringCountDefault } from "../board";
import { Slider } from "../Slider";
import { useGameState } from "../../hooks/useGameState";

export const App: React.FC = () => {
  const [ringCount, setRingCount] = React.useState(ringCountDefault);
  const [gameState, updateGameState] = useGameState();

  return (
    <div>
      <header className="App-header">
        <h2>Morris</h2>

        {/* We need to use the adjacency in gameState to assign ids to the elements drawn by this component */}
        <Board
          gameState={gameState}
          onPlay={(play) => {
            updateGameState(play);
          }}
        />

        {/* Temporarily adding a slider to control the number of rings */}
        {/* <Slider
          min={minRings}
          max={maxRings}
          value={ringCount}
          onChange={(e) => setRingCount(Number(e.target.value))}
          ringCount={ringCount}
        /> */}

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
          style={{ color: palette.primary, margin: ".83em 0" }}
        >
          github
        </a>

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
      </header>
    </div>
  );
};

export default App;
