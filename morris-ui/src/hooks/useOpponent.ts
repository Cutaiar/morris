import React from "react";
import { getNextMoveMinimax } from "morris-ai";
import { Action, GameState, Player } from "morris-core";
import {
  AIID,
  getNextMoveRandom,
  getNextMoveSmart,
  NextMoveFunction
} from "morris-ai";

type OpponentStatus = "waiting" | "thinking";
interface UseOpponentReturn {
  status: OpponentStatus;
}

/**
 * Get an opp. to play with
 */
export const useOpponent = (
  state: GameState,
  player: Player,
  speed: number /** Thinking time in MS */,
  onDecision: (action: Action) => void,
  ai: AIID
): UseOpponentReturn => {
  const [status, setStatus] = React.useState<OpponentStatus>("waiting");

  const nextMoveFnByDifficulty: Record<AIID, NextMoveFunction> = {
    rand: getNextMoveRandom,
    smart: getNextMoveSmart,
    minimax: getNextMoveMinimax
  };
  const nextMoveFn = nextMoveFnByDifficulty[ai];

  React.useEffect(() => {
    let timer: number | undefined = undefined;
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
      }, speed);
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
