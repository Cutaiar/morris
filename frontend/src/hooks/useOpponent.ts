import React from "react";
import { getRandomElement, getRandomProperty } from "utils";
import {
  Action,
  GameState,
  getOpponent,
  isValidAction,
  Player,
} from "./useGameState";

type OpponentStatus = "waiting" | "thinking";
interface useOpponentReturn {
  status: OpponentStatus;
}

export type OpponentDifficulty = "easy" | "medium";

/**
 * Get the next move an opponent should make given the status to the game.
 * Moves are picked at random
 */
export const getNextMoveRandom = (state: GameState): Action | undefined => {
  // Generate an action at random, but appropriate to what is happening in the game
  let action: Action | undefined = undefined;
  if (state.turn.type === "remove") {
    action = { type: "remove", to: getRandomProperty(state.stateGraph) };
  } else {
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
  }

  // If that action was invalid, ignore it
  if (action && !isValidAction(action, state)) {
    action = undefined;
  }

  // Recursively do the above until you find a valid move
  if (!action) {
    action = getNextMoveRandom(state);
  }

  // Found a valid move so return it for dispatch
  return action;
};

/**
 * Get the next move an opponent should make given the status to the game.
 * Employ some basic analysis of the board to make a move towards winning the game.
 */
const getNextMoveSmart = (state: GameState): Action | undefined => {
  // Generate an action at random, but appropriate to what is happening in the game
  let action: Action | undefined = undefined;
  if (state.turn.type === "remove") {
    // Get all the other players occupied spots
    const potentialRemoves = Object.entries(state.stateGraph)
      .filter((e) => e[1].occupancy === getOpponent(state.turn.player))
      .map((e) => e[0]);

    const removal = getRandomElement(potentialRemoves);
    action = { type: "remove", to: removal };
  } else {
    if (state.phase === 1) {
      // Get all the spots occupied by me...
      const myOccupiedPoints = Object.entries(state.stateGraph).filter(
        (e) => e[1].occupancy === state.turn.player
      );
      // Get all the points next to those (and dedup using Set)
      const potentialPlacements = [
        ...new Set(myOccupiedPoints.flatMap((p) => p[1].neighbors)),
      ];

      // If I had no occupied spots, pick one at random, otherwise pick a random neighbor spot
      const placement =
        potentialPlacements.length === 0
          ? getRandomProperty(state.stateGraph)
          : getRandomElement(potentialPlacements);

      action = { type: "place", to: placement };
    }
    if (state.phase === 2) {
      // TODO: Calculate all the moves that could make a mill and pick one at random
      action = {
        type: "move",
        from: getRandomProperty(state.stateGraph),
        to: getRandomProperty(state.stateGraph),
      };
    }
  }

  // If that action was invalid, ignore it
  if (action && !isValidAction(action, state)) {
    action = undefined;
  }

  // Recursively do the above until you find a valid move
  if (!action) {
    action = getNextMoveSmart(state);
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
  onDecision: (action: Action) => void,
  difficulty?: OpponentDifficulty
): useOpponentReturn => {
  const opponentThinkingTime = 1000;
  const [status, setStatus] = React.useState<OpponentStatus>("waiting");

  const nextMoveFn =
    difficulty === "medium" ? getNextMoveSmart : getNextMoveRandom;

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
