import React from "react";

// Theme
import { palette } from "theme";

// Components
import { IconButton } from "components";

export type OpponentType = "ai" | "local" | "online";
export interface OpponentSelectorProps {
  onDecision?: (opponentType: OpponentType) => void;
}

export const OpponentSelector = (props: OpponentSelectorProps) => {
  const { onDecision } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: "large", color: palette.neutral, margin: 0 }}>
        Choose your opponent
      </h1>
      <div style={{ display: "flex", gap: 20 }}>
        <IconButton
          onClick={() => onDecision?.("ai")}
          name={"box"}
          text={"AI"}
        />

        <IconButton
          onClick={() => onDecision?.("local")}
          name={"users"}
          text={"Local"}
        />
        <IconButton
          onClick={() => onDecision?.("online")}
          name={"wifi"}
          text={"Online"}
        />
      </div>
    </div>
  );
};
