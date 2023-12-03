import * as React from "react";

// Types
import { Player } from "hooks/useGameState";

// Style
import { palette } from "theme";

export interface RemainingMenProps {
  remainingMenCount: number;
  player?: Player;
}

/**
 * Renders a remaining men UI. If player is undefined, disabled/loading state is shown
 */
export const RemainingMen: React.FC<RemainingMenProps> = (props) => {
  const { remainingMenCount, player } = props;

  const diameter = 20;
  const gap = diameter / 4; // Gap between points

  const Man = (i: number) => (
    <div
      style={{
        width: diameter,
        height: diameter,
        borderRadius: "50%",
        margin: gap,
        background: player
          ? player === "a"
            ? palette.primary
            : palette.secondary
          : palette.neutral,
      }}
      key={i}
    />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: gap }}>
      <label style={{ fontSize: "medium", color: palette.neutral }}>
        remaining men
      </label>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "start",
          borderRadius: 5,
          border: `1px solid ${palette.neutral}`,
          padding: gap,
          width: ((diameter + gap * 2) * 6) + gap * 3, // 6 points to a row before wrapping plus magic extra. TODO: Use css to do this wrapping
          minHeight: diameter + gap * 2, // Maintain height after last man is gone
        }}
      >
        {new Array(remainingMenCount).fill(undefined).map((_, i) => Man(i))}
      </div>
    </div>
  );
};
