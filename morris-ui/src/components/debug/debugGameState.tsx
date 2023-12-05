import React from "react";

import { GameState } from "hooks/useGameState";
import { fontSizes } from "theme";

export interface DebugGameStateProps {
  gameState: GameState;
}
export const DebugGameState = (props: DebugGameStateProps) => {
  const { gameState } = props;
  return (
    <div
      style={{
        height: "80vh",
        overflow: "auto",
        position: "absolute",
        top: 100,
        left: 20,
      }}
    >
      <label>Game State</label>
      <p
        style={{
          fontSize: fontSizes.small,
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(gameState, null, 4)}
      </p>
    </div>
  );
};
