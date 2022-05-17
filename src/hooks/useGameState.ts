import React from "react";

export type Phase = 1 | 2 | 3;
export type Player = "a" | "b";
export type Occupancy = Player;
export type PointID = string;
export type Point = {
  neighbors: PointID[];
  occupancy?: Occupancy;
};
type StateGraph = Record<PointID, Point>;

// Initial state graph just defines adjacency. occupancy is omitted as there are no pieces to start
// This state graph represents the adjacency for 6 man morris (2 rings)
const initialStateGraph: StateGraph = {
  // inner ring
  a: { neighbors: ["b", "h"] },
  b: { neighbors: ["a", "c", "j"] },
  c: { neighbors: ["b", "d"] },
  d: { neighbors: ["c", "e", "l"] },
  e: { neighbors: ["d", "f"] },
  f: { neighbors: ["e", "g", "n"] },
  g: { neighbors: ["f", "h"] },
  h: { neighbors: ["g", "a", "p"] },

  // outer ring
  i: { neighbors: ["l", "p"] },
  j: { neighbors: ["i", "k", "b"] },
  k: { neighbors: ["j", "l"] },
  l: { neighbors: ["k", "m", "d"] },
  m: { neighbors: ["l", "m"] },
  n: { neighbors: ["m", "o", "f"] },
  o: { neighbors: ["n", "p"] },
  p: { neighbors: ["o", "i", "h"] },
};

const initialState: GameState = {
  phase: 1,
  turn: { count: 0, player: "a" },
  stateGraph: initialStateGraph,
  remainingMen: { a: 6, b: 6 },
};

export interface GameState {
  phase: Phase;
  turn: { count: number; player: Player };
  remainingMen: Record<Player, number>;
  stateGraph: StateGraph;
}

export interface PlayAction extends BaseAction {
  type: "play";
  from: PointID;
  to: PointID;
}

export interface PlaceAction extends BaseAction {
  type: "place";
  to: PointID;
}

interface ResetAction extends BaseAction {
  type: "reset";
}

type ActionType = "play" | "reset" | "place";
interface BaseAction {
  type: ActionType;
}

type Action = PlayAction | ResetAction | PlaceAction;

const getOtherPlayer = (player: Player): Player => {
  return player === "a" ? "b" : "a";
};

/**
 * Validate a place action.
 * Expected scenarios:
 * - location must not be occupied
 *
 * Unexpected scenarios:
 * - current player must have >= 1 remaining man
 * - The game is not in phase 1
 */
const validatePlace = (action: PlaceAction, state: GameState): boolean => {
  const currentPlayer = state.turn.player;
  return (
    state.stateGraph[action.to].occupancy === undefined &&
    state.remainingMen[currentPlayer] >= 1 &&
    state.phase === 1
  );
};

/**
 * Determine if the game state is in the next phase
 */
const isNextPhase = (state: GameState): boolean => {
  switch (state.phase) {
    // Phase 1 moves to phase 2 when there are no more remaining men
    case 1:
      return Object.values(state.remainingMen).every((rm) => rm === 0);

    // TODO: Phase 2 moves to phase 3 when...
    case 2:
      return false;

    // There is no phase 4, so the game can never advance from 3
    case 3:
      return false;

    // All phases were covered above, so if we get here, something went wrong
    default:
      throw new Error(
        `An invalid phase value of ${state.phase} was encountered in isNextPhase`
      );
  }
};

const incrementPhase = (phase: Phase): Phase => {
  const nextPhase = phase + 1;

  // This range should match the range defined in the Phase type
  if (nextPhase > 3 || nextPhase < 1) {
    throw new Error(
      `An attempt to increment phase to ${nextPhase} was made. This is outside its valid range`
    );
  }
  return nextPhase as Phase;
};

const reducer = (state: GameState, action: Action): GameState => {
  const currentPlayer = state.turn.player;
  const otherPlayer = getOtherPlayer(currentPlayer);

  switch (action.type) {
    // A play in phase 1
    case "place":
      // Validate the place action
      // TODO: How do we communicate the correct thing to do?
      // TODO Should we validate before even allowing the action?
      if (!validatePlace(action, state)) {
        console.log("Invalid place action");
        return state;
      }

      const newState = {
        ...state,
        stateGraph: {
          ...state.stateGraph,

          // Occupy the "to" location with the player who made this play
          // TODO: check that it was valid
          [action.to]: {
            ...state.stateGraph[action.to],
            occupancy: currentPlayer,
          },
        },
        // When a play is made, the count increments and it becomes the other players turn
        turn: {
          player: otherPlayer,
          count: state.turn.count + 1,
        },

        // Remove 1 man from the current players remaining men
        remainingMen: {
          ...state.remainingMen,
          [currentPlayer]: state.remainingMen[currentPlayer] - 1,
        },
      };

      // Check if the new state moves the game into the next phase
      return isNextPhase(newState)
        ? { ...newState, phase: incrementPhase(state.phase) }
        : newState;

    // A play in phase 2
    case "play":
      // TODO: check for win
      return {
        ...state,
        stateGraph: {
          ...state.stateGraph,

          // Occupy the "to" location with the player who made this play
          // TODO: make sure to move the from and check that it was valid
          [action.to]: {
            ...state.stateGraph[action.to],
            occupancy: currentPlayer,
          },
        },
        // When a play is made, the count increments and it becomes the other players turn
        turn: {
          player: otherPlayer,
          count: state.turn.count + 1,
        },
      };
    // TODO Check if the new state moves the game into the next phase

    case "reset":
      return initialState;
    default:
      throw new Error(
        `Unsupported action in encountered in useGameState: ${action}`
      );
  }
};

/**
 * A reducer like hook which holds the entire state of the game
 */
export const useGameState = () => {
  return React.useReducer(reducer, initialState);
};
