import React from "react";
import { palette } from "../../theme";
import { Board } from "../board";
import "./App.css";

export const App: React.FC = () => {
  return (
    <div>
      <header className="App-header">
        <h2>Morris</h2>
        <Board />

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
