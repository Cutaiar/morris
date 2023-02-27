import * as React from "react";
import { palette } from "theme";

/**
 * A tag to be shown in indication that the current turn is a removal
 */
export const ToRemove = () => {
  return (
    <div
      style={{
        background: "rgb(74, 74, 74)",
        borderRadius: 5,
        padding: 5,
        boxSizing: "border-box",
        fontSize: "small",
        color: palette.neutralLight,
      }}
    >
      {"to remove"}
    </div>
  );
};
