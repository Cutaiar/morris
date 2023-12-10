// File contains utils used in the frontend morris web app

import { Player } from "morris-core";
import { DefaultTheme } from "styled-components";

/**
 * Destructure into props to make a link safely open in a new tab
 */
export const openInNewTabProps = {
  target: "_blank",
  rel: "noopener noreferrer"
};

export const getChipColor = (theme: DefaultTheme, player?: Player) => {
  return player
    ? player === "a"
      ? theme.palette.primary
      : theme.palette.secondary
    : theme.palette.neutral;
};
