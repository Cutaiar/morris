import * as React from "react";
import { Player } from "../../hooks/useGameState";
import { palette } from "../../theme";

export interface RemainingMenProps {
  remainingMenCount: number;
  player: Player;
}

export const RemainingMen: React.FC<RemainingMenProps> = (props) => {
  const { remainingMenCount, player } = props;

  const radius = 10;
  const gap = 2 * radius;
  const width = (radius + gap) * 7; // This magic number is the max remaining count + 1
  const height = radius + gap;

  // This could be implemented with divs and flexbox instead, but i'm on an svg bender rn so...
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x1={0}
        y1={0}
        width={"100%"}
        height={"100%"}
        rx="5"
        stroke={palette.neutral}
        fillOpacity={0}
      />
      {new Array(remainingMenCount).fill(undefined).map((_, i) => (
        <circle
          cx={(i + 1) * (gap + radius)}
          cy={"50%"}
          r={radius}
          fill={player === "a" ? palette.primary : palette.secondary}
          key={i}
        />
      ))}
    </svg>
  );
};
