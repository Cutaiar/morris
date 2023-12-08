import React from "react";

// Style
import { defaultTheme, palette, GlobalStyle } from "theme";
import { ThemeProvider } from "styled-components";

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
        <ThemeProvider theme={defaultTheme}>
          <Game />
          <GithubCorner
            href="https://github.com/Cutaiar/morris"
            bannerColor={palette.neutral}
            octoColor={palette.background}
            size={85}
            direction="right"
            {...openInNewTabProps}
          />
          <GlobalStyle/>
        </ThemeProvider>
      </SocketProvider>
    </PrefsProvider>
  );
};
