import React from "react";
import { palette } from "../../theme";
import { Board } from "../board";
import "./App.css";

export const App: React.FC = () => {
  return (
    <div>
      <header className="App-header">
        <Board />
        <a
          href="https://github.com/Cutaiar/morris"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: palette.primary }}
        >
          github repo
        </a>
      </header>
    </div>
  );
};

export default App;
