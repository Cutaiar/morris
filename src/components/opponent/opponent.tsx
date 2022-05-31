import React from "react";
import { Action, GameState, Player } from "../../hooks/useGameState";
import { useOpponent } from "../../hooks/useOpponent";
import { palette } from "../../theme";

// export type OpponentProps = Parameters<typeof useOpponent>;
export type OpponentProps = {
  state: GameState;
  player: Player;
  updateGameState: React.Dispatch<Action>;
};

export const Opponent: React.FC<OpponentProps> = (props) => {
  const { state, player, updateGameState } = props;
  const { status } = useOpponent(state, player, updateGameState);
  return (
    <label style={{ fontSize: "medium" }}>
      {`opponent is `}
      <i style={{ color: palette.secondary }}>{status}</i>
    </label>
  );
};
