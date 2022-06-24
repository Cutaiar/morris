import React from "react";

import { palette } from "../../theme";
import { Button } from "../../components";

export type OpponentType = "ai" | "local" | "online";
export interface OpponentSelectorProps {
  onDecision?: (opponentType: OpponentType) => void;
}

export const OpponentSelector = (props: OpponentSelectorProps) => {
  const { onDecision } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: "large", color: palette.neutralLight }}>
        Choose your opponent
      </h1>
      <div style={{ display: "flex", gap: 20 }}>
        <Button onClick={() => onDecision?.("ai")}>Play AI</Button>
        <Button onClick={() => onDecision?.("local")}>Play local</Button>
        {/* TODO: enable online mode nad enable this button */}
        <Button onClick={() => onDecision?.("online")} disabled>
          Play online
        </Button>
      </div>
    </div>
  );
};
