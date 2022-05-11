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
      <MorrisSquare
        size={size * 0.9}
        vbsize={size}
        fill={"grey"}
        nodeFill={palette.primary}
      />
      <MorrisSquare
        size={size * 0.5}
        vbsize={size}
        fill={"lightgrey"}
        nodeFill={palette.primary}
      />
    </svg>
  );
};

type MorrisSquareProps = {
  size: number;
  vbsize: number;
  fill: string;
  nodeFill: string;
};
const MorrisSquare = (props: MorrisSquareProps) => {
  const { size, vbsize, fill, nodeFill } = props;
  const offset = vbsize - size;
  const origin = offset / 2;

  return (
    <g>
      <rect
        x={origin}
        y={origin}
        width={size}
        height={size}
        rx="5"
        fill={fill}
      />
      <circle cx={origin} cy={offset / 2} r="10" fill={nodeFill} />
      <circle cx={origin + size / 2} cy={offset / 2} r="10" fill={nodeFill} />

      <circle cx={size + offset / 2} cy={offset / 2} r="10" fill={nodeFill} />
      <circle
        cx={size + offset / 2}
        cy={origin + size / 2}
        r="10"
        fill={nodeFill}
      />

      <circle
        cx={size + offset / 2}
        cy={size + origin}
        r="10"
        fill={nodeFill}
      />
      <circle
        cx={origin + size / 2}
        cy={size + origin}
        r="10"
        fill={nodeFill}
      />

      <circle cx={offset / 2} cy={size + origin} r="10" fill={nodeFill} />
      <circle cx={offset / 2} cy={size / 2 + origin} r="10" fill={nodeFill} />
    </g>
  );
};
