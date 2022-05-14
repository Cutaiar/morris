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
        <Board ringCount={ringCount} />

        {/* Temporarily adding a slider to control the number of rings */}
        <Slider
          min={minRings}
          max={maxRings}
          value={ringCount}
          onChange={(e) => setRingCount(Number(e.target.value))}
          ringCount={ringCount}
        />

        <a
          href="https://github.com/Cutaiar/morris"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: palette.primary, margin: ".83em 0" }}
        >
          github
        </a>
      </header>
    </div>
  );
};

export default App;