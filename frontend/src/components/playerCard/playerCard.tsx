import React from "react";

import { Player } from "../../hooks/useGameState";
import { palette } from "../../theme";
import { RemainingMen } from "../RemainingMen/RemainingMen";

export interface PlayerCardProps {
  /** Which player is this. undefined if not determined yet */
  player?: Player;
  /** Is the current turn a removal?*/
  remove?: boolean;
  /** Who's turn is it */
  turn: Player;
  /** Name of this player*/
  name: string;
  /** How many remaining men for this player?*/
  remainingMen: number;
}

export const PlayerCard = (props: PlayerCardProps) => {
  const { player, remove, turn, name, remainingMen } = props;

  const myTurn = player === turn;
  const isRemove = remove && myTurn;
  const labelColor = myTurn ? palette.neutralLight : palette.neutral;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "medium",
          gap: 10,
        }}
      >
        <label style={{ color: labelColor, fontSize: "larger" }}>{name}</label>
        {/* TODO: State for player loading */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            background: player === "a" ? palette.primary : palette.secondary,
            border: myTurn ? `1px solid ${palette.neutralLight}` : undefined,
          }}
        />
        {isRemove && <i>{" (to remove)"}</i>}
      </div>
      <label style={{ fontSize: "medium" }}>remaining men:</label>
      {/* TODO: Shimmer */}
      {player && (
        <RemainingMen remainingMenCount={remainingMen} player={player} />
      )}
    </>
  );
};