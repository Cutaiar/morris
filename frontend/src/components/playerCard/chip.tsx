import { Player } from "hooks/useGameState";
import React from "react";
import { palette } from "../../theme";

interface ChipProps {
  /** The player this chip represents */
  player?: Player;
  /** Is it `player`'s turn? */
  isMyTurn?: boolean;
  /** Is the current turn a removal. Should only be true if `isMyTurn` is true too*/
  isRemovalTurn?: boolean;
}
/**
 * Represents a player
 *
 * TODO: State for player loading
 */
export const Chip = (props: ChipProps) => {
  const { player, isMyTurn, isRemovalTurn } = props;

  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        background: player
          ? player === "a"
            ? palette.primary
            : palette.secondary
          : palette.neutral,
        border: isMyTurn ? `1px solid ${palette.neutralLight}` : undefined,
      }}
    >
      {isRemovalTurn && <i>{" (to remove)"}</i>}
    </div>
  );
};
