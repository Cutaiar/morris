import React from "react";
import { useInterval } from "react-use";

const cursors = [
  "auto",
  "default",
  "none",
  "context-menu",
  "help",
  "pointer",
  "progress",
  "wait",
  "cell",
  "crosshair",
  "text",
  "vertical-text",
  "alias",
  "copy",
  "move",
  "no-drop",
  "not-allowed",
  "all-scroll",
  "col-resize",
  "row-resize",
  "n-resize",
  "e-resize",
  "s-resize",
  "w-resize",
  "ns-resize",
  "ew-resize",
  "ne-resize",
  "nw-resize",
  "se-resize",
  "sw-resize",
  "nesw-resize",
  "nwse-resize",
];

/**
 * Make the cursor go crazy
 * // TODO: Something taking advantage of url cursor images to make an animation would be cool
 */
export const useHyperCursor = () => {
  const [cursor, setCursor] = React.useState(cursors[0]);
  useInterval(() => {
    const i = Math.floor(Math.random() * cursors.length);
    setCursor(cursors[i]);
  }, 30);
  return cursor;
};
