import React from "react";

// Types
import { Action, GameState, Player } from "hooks/useGameState"; // TODO: imports should come from elsewhere

// Hooks
import { useOpponent } from "hooks";
import { OpponentDifficulty } from "hooks/useOpponent";

// Style
import { palette } from "theme";

// Sound
import { HasSound } from "../board/board"; // TODO: import should come from elsewhere
import useSound from "use-sound";
import opponentSound from "sound/octave-tap/tap-wooden.mp3";

// export type OpponentProps = Parameters<typeof useOpponent>;
export interface OpponentProps extends HasSound {
  state: GameState;
  player: Player;
  updateGameState: React.Dispatch<Action>;
  difficulty: OpponentDifficulty;
}

export const Opponent: React.FC<OpponentProps> = (props) => {
  const { state, player, updateGameState, sound, difficulty } = props;

  const [play] = useSound(opponentSound);

  const handleDecision = (action: Action) => {
    sound && play();
    updateGameState(action);
  };

  const { status } = useOpponent(state, player, handleDecision, difficulty);
  return (
    <span style={{ fontSize: "medium" }}>
      {`opponent is `}
      <i style={{ color: palette.secondary }}>{status}</i>
    </span>
  );
};
