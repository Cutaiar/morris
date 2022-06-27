import React from "react";
import { getRandomProperty } from "../components/utils/utils";
import { Action, GameState, isValidAction, Player } from "./useGameState";

type OpponentStatus = "waiting" | "thinking";
interface useOpponentReturn {
  status: OpponentStatus;
}

/**
 * Get the next move an opponent should make given the status to the game
 */
export const getNextMove = (state: GameState): Action | undefined => {
  // Generate an action at random, but appropriate to what is happening in the game
  let action: Action | undefined = undefined;
  if (state.turn.type === "remove") {
    action = { type: "remove", to: getRandomProperty(state.stateGraph) };
  }
  if (state.phase === 1) {
    action = { type: "place", to: getRandomProperty(state.stateGraph) };
  }
  if (state.phase === 2) {
    action = {
      type: "move",
      from: getRandomProperty(state.stateGraph),
      to: getRandomProperty(state.stateGraph),
    };
  }

  // If that action was invalid, ignore it
  if (action && !isValidAction(action, state)) {
    action = undefined;
  }

  // Recursively do the above until you find a valid move
  if (!action) {
    action = getNextMove(state);
  }

  // Found a valid move so return it for dispatch
  return action;
};

/**
 * Get an opp. to play with
 */
export const useOpponent = (
  state: GameState,
  player: Player,
  onDecision: (action: Action) => void
): useOpponentReturn => {
  const opponentThinkingTime = 1000;
  const [status, setStatus] = React.useState<OpponentStatus>("waiting");

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    // If it is our turn
    if (state.turn.player === player) {
      // Declare that we are thinking, and after some time, dispatch an appropriate action
      setStatus("thinking");
      timer = setTimeout(() => {
        const action = getNextMove(state);
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
  }, [player, state, state.turn.player, onDecision]);

  return { status: status };
};
