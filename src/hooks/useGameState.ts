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

type Turn = { count: number; player: Player; type: "remove" | "regular" };

interface Mill {
  points: PointID[];
  occupancy?: Occupancy;
  active?: boolean;
}
export interface GameState {
  phase: Phase;
  turn: Turn;
  remainingMen: Record<Player, number>;
  stateGraph: StateGraph;
  mills: Mill[];
}

interface BaseAction {
  type: ActionType;
}

export interface PlaceAction extends BaseAction {
  type: "place";
  to: PointID;
}

export interface MoveAction extends BaseAction {
  type: "move";
  from: PointID;
  to: PointID;
}

export interface RemoveAction extends BaseAction {
  type: "remove";
  to: PointID;
}

interface ResetAction extends BaseAction {
  type: "reset";
}

type ActionType = "place" | "move" | "remove" | "reset";

export type Action = PlaceAction | MoveAction | RemoveAction | ResetAction;

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

// These represent the "lines" which a mill must be formed on. They could be autogenerated with a simple formula
// The advantage of storing this separately from the state graph is that it gives us flexibility in what makes a mill line.
const initialMills: Mill[] = [
  // inner ring
  { points: ["a", "b", "c"] },
  { points: ["c", "d", "e"] },
  { points: ["e", "f", "g"] },
  { points: ["g", "h", "a"] },

  // outer ring
  { points: ["i", "j", "k"] },
  { points: ["k", "l", "m"] },
  { points: ["m", "n", "o"] },
  { points: ["o", "p", "i"] },
];

/**
 * Initial state of the game
 */
const initialState: GameState = {
  phase: 1,
  turn: { count: 0, player: "a", type: "regular" },
  stateGraph: initialStateGraph,
  remainingMen: { a: 6, b: 6 },
  mills: initialMills,
};

/**
 * Given a player, get the opponent
 */
const getOpponent = (player: Player): Player => {
  return player === "a" ? "b" : "a";
};

/**
 * Tell whether or not the selection of `pointID` is valid. To be used externally by UI to allow/disallow the selection of a point
 */
export const isValidSelection = (
  pointID: PointID,
  state: GameState
): boolean => {
  return state.stateGraph[pointID].occupancy === state.turn.player;
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

/**
 * Increment `phase`, throwing if an invalid increment was attempted
 */
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

/**
 * Given the current state of the game, calculate the next mills
 * This includes:
 * - deactivating mills from the last turn
 * - activating and occupying mills formed this turn
 */
const nextMills = (state: GameState): Mill[] => {
  return state.mills.map((mill) => {
    // Grab the stateGraph occupancy of the first point in the mill
    const firstOcc = state.stateGraph[mill.points[0]].occupancy;

    // Lets see if the potential mill is still a mill
    // Do this by seeing if the stateGraph has the same occupancy as first (if defined) along the millLine
    const isMill = mill.points.every((pointID) => {
      return firstOcc && state.stateGraph[pointID].occupancy === firstOcc;
    });

    // Mill is still qualified
    if (isMill) {
      if (mill.occupancy) {
        // If this occupied mill is active, deactivate it, it must have been "used" already
        if (mill.active) {
          return { ...mill, active: undefined };
        }
        // If this occupied mill is not active, let it be, its just a "resting" mill
        return mill;
      }
      // Mill is not occupied
      else {
        // Bail is something weird happens
        if (mill.active) {
          throw new Error(
            "Found an active, unoccupied, but qualified mill when calculating next mills"
          );
        }
        // We found a new mill
        console.log("new mill for " + firstOcc);
        return { ...mill, occupancy: firstOcc, active: true };
      }
    }
    // Mill is not qualified
    else {
      // If this unqualified mill is still occupied, it must have been broken. It should no longer be occupied
      if (mill.occupancy) {
        return { ...mill, occupancy: undefined, active: undefined };
      }

      // Unqualified mill is not occupied
      else {
        // Bail is something weird happens
        if (mill.active) {
          throw new Error(
            "Found an active, unoccupied, unqualified mill when calculating next mills"
          );
        }
        // These are just potential mills that need no update
        return mill;
      }
    }
  });
};

/**
 * Given the game state, calculate the next turn.
 * This involves:
 * - deciding if the next turn is a removal turn
 * - who it goes to
 * - incrementing the count
 *
 * Note: `nextTurn` should be called on a game state which has already had its mills updated
 */
const nextTurn = (state: GameState): Turn => {
  const currentPlayer = state.turn.player;
  const opponent = getOpponent(currentPlayer);

  // Next turn is a removal if:
  // current turn is not a removal and
  // current player has an active mill
  const isRemoval =
    state.turn.type !== "remove" &&
    state.mills.some((mill) => mill.occupancy === currentPlayer && mill.active);

  return {
    ...state.turn,
    type: isRemoval ? "remove" : "regular",
    player: isRemoval ? currentPlayer : opponent,
    count: state.turn.count + 1,
  };
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
const isValidPlace = (action: PlaceAction, state: GameState): boolean => {
  const currentPlayer = state.turn.player;
  return (
    state.stateGraph[action.to].occupancy === undefined &&
    state.remainingMen[currentPlayer] >= 1 &&
    state.phase === 1
  );
};

/**
 * Validate a move action.
 * Expected scenarios:
 * - location must not be occupied
 * - Can only move the current players man
 *
 * Unexpected scenarios:
 * - current player must have no remaining man
 * - The game is not in phase 2
 */
const isValidMove = (action: MoveAction, state: GameState): boolean => {
  const currentPlayer = state.turn.player;
  return (
    state.stateGraph[action.to].occupancy === undefined &&
    state.stateGraph[action.from].occupancy === currentPlayer &&
    state.remainingMen[currentPlayer] === 0 &&
    state.phase === 2
  );
};

/**
 * Validate a remove action.
 * Expected scenarios:
 * - location must be occupied
 * - Can only remove the opponents man
 * - TODO can only remove a man in a mill if there is no other option
 *
 * Unexpected scenarios:
 * - turn must be of type removal
 */
const isValidRemove = (action: RemoveAction, state: GameState): boolean => {
  const occ = state.stateGraph[action.to].occupancy;
  return (
    occ !== undefined &&
    occ !== state.turn.player &&
    state.turn.type === "remove"
    // TODO can only remove a man in a mill if there is no other option
  );
};

const nextStateAfterPlace = (state: GameState, action: PlaceAction) => {
  const currentPlayer = state.turn.player;

  // Validate the place action
  // TODO: How do we communicate the correct thing to do?
  // TODO Should we validate before even allowing the action?
  if (!isValidPlace(action, state)) {
    console.log("Invalid place action");
    return state;
  }

  // Update state with the action
  let nextState = {
    ...state,
    stateGraph: {
      ...state.stateGraph,
      // Occupy the "to" location with the player who made this play
      [action.to]: {
        ...state.stateGraph[action.to],
        occupancy: currentPlayer,
      },
    },
    // Remove 1 man from the current players remaining men
    remainingMen: {
      ...state.remainingMen,
      [currentPlayer]: state.remainingMen[currentPlayer] - 1,
    },
  };

  // Update the mills in game state
  nextState = { ...nextState, mills: nextMills(nextState) };

  // Update the turn (which is dependent on the updated mills)
  nextState = { ...nextState, turn: nextTurn(nextState) };

  // TODO: Check for win? Can you win in this phase?

  // Check if the new state moves the game into the next phase
  return isNextPhase(nextState)
    ? { ...nextState, phase: incrementPhase(state.phase) }
    : nextState;
};

const nextStateAfterMove = (state: GameState, action: MoveAction) => {
  const currentPlayer = state.turn.player;

  // Validate the move action
  // TODO: How do we communicate the correct thing to do?
  // TODO Should we validate before even allowing the action?
  if (!isValidMove(action, state)) {
    console.log("Invalid move action");
    return state;
  }

  // Update state with the action
  let nextState = {
    ...state,
    stateGraph: {
      ...state.stateGraph,
      // Occupy the "to" location with the player who made this play
      [action.to]: {
        ...state.stateGraph[action.to],
        occupancy: currentPlayer,
      },
      [action.from]: {
        ...state.stateGraph[action.from],
        occupancy: undefined,
      },
    },
  };

  // Update the mills in game state
  nextState = { ...nextState, mills: nextMills(nextState) };

  // Update the turn (which is dependent on the updated mills)
  nextState = { ...nextState, turn: nextTurn(nextState) };

  // TODO: Check for win

  // Check if the next state moves the game into the next phase
  return isNextPhase(nextState)
    ? { ...nextState, phase: incrementPhase(state.phase) }
    : nextState;
};

const nextStateAfterRemove = (state: GameState, action: RemoveAction) => {
  // Validate the remove action
  // TODO: How do we communicate the correct thing to do?
  // TODO Should we validate before even allowing the action?
  if (!isValidRemove(action, state)) {
    console.log("Invalid remove action");
    return state;
  }

  // Update state with the action
  let nextState = {
    ...state,
    stateGraph: {
      ...state.stateGraph,

      // Remove the man at "to" location
      [action.to]: {
        ...state.stateGraph[action.to],
        occupancy: undefined,
      },
    },
  };

  // Update the mills in game state (because it is possible that this removal broke a mill)
  nextState = { ...nextState, mills: nextMills(nextState) };

  // Update the turn (which is dependent on the updated mills? Maybe not for a remove)
  nextState = { ...nextState, turn: nextTurn(nextState) };

  // TODO: Check for win

  // Check if the new state moves the game into the next phase
  // TODO -- Do we need to do this here?
  return isNextPhase(nextState)
    ? { ...nextState, phase: incrementPhase(state.phase) }
    : nextState;
};

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    // A placement in phase 1
    case "place":
      return nextStateAfterPlace(state, action);
    // A move in phase 2
    case "move":
      return nextStateAfterMove(state, action);
    // A removal in the case a player made a mill and removes an opponents man
    case "remove":
      return nextStateAfterRemove(state, action);
    // We support resetting the game entirely
    case "reset":
      return initialState;
    // If a different action came in here, bail
    default:
      throw new Error(
        `Unsupported action in encountered in useGameState: ${action}`
      );
  }
};

/**
 * A reducer-like hook which holds the entire state of the game
 */
export const useGameState = () => {
  return React.useReducer(reducer, initialState);
};
