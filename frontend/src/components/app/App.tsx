import React from "react";

// Style
import "./app.css";
import { palette } from "../../theme";

// Components
import GithubCorner from "react-github-corner";
import { Game } from "../../components";

// Hooks
import { PrefsProvider } from "../../hooks";

// Context;
import { SocketProvider } from "../../context";

// Utils
import { openInNewTabProps } from "../../util";

export const App: React.FC = () => {
  return (
    <PrefsProvider>
      <SocketProvider>
        <Game />
        <GithubCorner
          href="https://github.com/Cutaiar/morris"
          bannerColor={palette.neutral}
          octoColor={palette.background}
          size={80}
          direction="right"
          {...openInNewTabProps}
        />
      </SocketProvider>
    </PrefsProvider>
  );
};
