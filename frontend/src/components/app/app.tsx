import React from "react";

// Style
import "./app.css";
import { palette } from "theme";

// Components
import GithubCorner from "react-github-corner";
import { Game } from "components";

// Hooks
import { defaultPrefs, PrefsProvider } from "hooks";

// Context;
import { SocketProvider } from "context";

// Utils
import { openInNewTabProps } from "utils";

export const App: React.FC = () => {
  return (
    // TODO: get initial prefs from the cache and cache any updates
    <PrefsProvider initialValue={defaultPrefs}>
      <SocketProvider>
        <Game />
        <GithubCorner
          href="https://github.com/Cutaiar/morris"
          bannerColor={palette.neutral}
          octoColor={palette.background}
          size={85}
          direction="right"
          {...openInNewTabProps}
        />
      </SocketProvider>
    </PrefsProvider>
  );
};
