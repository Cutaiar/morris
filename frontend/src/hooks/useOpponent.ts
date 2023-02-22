import React from "react";
import { getNextMoveMinimax } from "../morris-ai/getNextMoveMinimax";
import { Action, GameState, Player } from "morris-core";
import {
  getNextMoveRandom,
  getNextMoveSmart,
  NextMoveFunction,
} from "morris-ai";

type OpponentStatus = "waiting" | "thinking";
interface UseOpponentReturn {
  status: OpponentStatus;
}

export type OpponentDifficulty = "easy" | "medium" | "hard";

/**
 * Get an opp. to play with
 */
export const useOpponent = (
  state: GameState,
  player: Player,
  onDecision: (action: Action) => void,
  difficulty: OpponentDifficulty
): UseOpponentReturn => {
  const opponentThinkingTime = 1000;
  const [status, setStatus] = React.useState<OpponentStatus>("waiting");

  const nextMoveFnByDifficulty: Record<OpponentDifficulty, NextMoveFunction> = {
    easy: getNextMoveRandom,
    medium: getNextMoveSmart,
    hard: getNextMoveMinimax,
  };
  const nextMoveFn = nextMoveFnByDifficulty[difficulty];

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    // If it is our turn
    if (state.turn.player === player) {
      // Declare that we are thinking, and after some time, dispatch an appropriate action
      setStatus("thinking");
      timer = setTimeout(() => {
        const action = nextMoveFn(state);
        if (action) {
          onDecision(action);
          setStatus("waiting");
        }
      }, opponentThinkingTime);
    }

    // Clean up the timer in the case one was running when the host component unmounted
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [player, state, state.turn.player, onDecision, nextMoveFn]);

  return { status: status };
};
