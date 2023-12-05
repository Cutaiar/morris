import * as React from "react";
import { fontSizes, palette } from "theme";

/**
 * A tag to be shown in indication that the current turn is a removal
 */
export const ToRemove = () => {
  return (
    <div
      style={{
        background: palette.surface,
        borderRadius: 5,
        padding: 5,
        boxSizing: "border-box",
        fontSize: fontSizes.small,
        color: palette.neutral,
        borderColor: palette.neutral,
        borderStyle: "solid",
        borderWidth: 1,
      }}
    >
      {"to remove"}
    </div>
  );
};
