import React from "react";
import useSound from "use-sound";
import { Action, GameState, Player } from "../../hooks/useGameState";
import { useOpponent } from "../../hooks/useOpponent";
import { palette } from "../../theme";

import { HasSound } from "../board/board"; // TODO: import should come from elsewhere
import opponentSound from "../../sound/octave-tap/tap-wooden.mp3";

// export type OpponentProps = Parameters<typeof useOpponent>;
export interface OpponentProps extends HasSound {
  state: GameState;
  player: Player;
  updateGameState: React.Dispatch<Action>;
}

export const Opponent: React.FC<OpponentProps> = (props) => {
  const { state, player, updateGameState, sound } = props;

  const [play] = useSound(opponentSound);

  const handleDecision = (action: Action) => {
    sound && play();
    updateGameState(action);
  };

  const { status } = useOpponent(state, player, handleDecision);
  return (
    <span style={{ fontSize: "medium" }}>
      {`opponent is `}
      <i style={{ color: palette.secondary }}>{status}</i>
    </span>
  );
};
