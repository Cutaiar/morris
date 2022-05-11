import React from "react";
import { palette } from "../../theme";

export interface BoardProps {
  /** pixel size of the board */
  size?: number;
}

/**
 * Represents the morris board to be played on. Currently just messing around with declarative graphics
 */
export const Board: React.FC<BoardProps> = (props) => {
  const size = props.size ?? 400;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect
        x={(size - 0.8 * size) / 2}
        y={(size - 0.8 * size) / 2}
        width={0.8 * size}
        height={0.8 * size}
        rx="5"
        fill={palette.neutral}
      />
      <rect
        x={(size - 0.5 * size) / 2}
        y={(size - 0.5 * size) / 2}
        width={0.5 * size}
        height={0.5 * size}
        rx="5"
        fill={palette.primary}
      />
    </svg>
  );
};
