import React from "react";

// Style
import { defaultTheme, GlobalStyle } from "theme";
import { ThemeProvider, useTheme } from "styled-components";

// Components
import GithubCorner, { GithubCornerProps } from "react-github-corner";
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
          <ThemedGithubCorner
            href="https://github.com/Cutaiar/morris"
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

// TODO: is this the easiest way to theme the component without moving it in the three?
const ThemedGithubCorner = (props: GithubCornerProps) => {
  const theme = useTheme();
  return <GithubCorner 
            bannerColor={theme.palette.neutral}
            octoColor={theme.palette.background}
            {...props}
          />
}