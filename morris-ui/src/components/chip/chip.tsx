import React from "react";

// Style
import { palette } from "theme";

interface ChipProps {
  /** The player this chip represents */
  color?: string;
  /** Is it `player`'s turn? */
  emphasis?: boolean;
}

/**
 * Represents a player
 *
 * TODO: State for player loading
 */
export const Chip = (props: ChipProps) => {
  const { color, emphasis } = props;

  return (
    <div
      style={{
        minWidth: 20,
        minHeight: 20,
        borderRadius: "50%",
        background: color,
        border: emphasis ? `1px solid ${palette.neutral}` : undefined,
      }}
    ></div>
  );
};
