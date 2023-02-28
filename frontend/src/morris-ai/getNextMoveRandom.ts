import { Action, GameState, isValidAction, nextValidMoves } from "morris-core";
import { getRandomElement, getRandomProperty } from "morris-core/utils";
import { NextMoveFunction } from "./types";

/**
 * Get the next move an opponent should make given the status to the game.
 * Moves are picked at random
 */
export const getNextMoveRandomRecursive: NextMoveFunction = (
  state: GameState
) => {
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

/** A better implementation of the fn with the same name above */
export const getNextMoveRandom: NextMoveFunction = (gameState: GameState) => {
  const moves = nextValidMoves(gameState);

  let action: Action;
  if (Array.isArray(moves)) {
    const to = getRandomElement(moves);
    action = {
      type: gameState.turn.type === "remove" ? "remove" : "place",
      to,
    };
  } else {
    const nonEmptyMoves = Object.entries(moves)
      .filter((m) => m[1].length !== 0)
      .map((m) => m[0]);
    const from = getRandomElement(nonEmptyMoves);
    const to = getRandomElement(moves[from]);
    action = { type: "move", from, to };
  }

  if (!action) {
    throw new Error("getNextMoveRandom was unable to produce a valid action");
  }

  return action;
};
