import React from "react";

type Occupancy = "a" | "b";
type PointID = string;
type Point = {
  neighbors: PointID[];
  occupancy?: Occupancy;
};
type StateGraph = Record<PointID, Point>;

// Initial state graph just defines adjacency. occupancy is omitted as there are no pieces to start
// This state graph represents the adjacency for 6 man morris (2 rings)
const initialStateGraph: StateGraph = {
  // outer ring
  a: { neighbors: ["b", "h"] },
  b: { neighbors: ["a", "c", "j"] },
  c: { neighbors: ["b", "d"] },
  d: { neighbors: ["c", "e", "l"] },
  e: { neighbors: ["d", "f"] },
  f: { neighbors: ["e", "g", "n"] },
  g: { neighbors: ["f", "h"] },
  h: { neighbors: ["g", "a", "p"] },

  // inner ring
  i: { neighbors: ["l", "p"] },
  j: { neighbors: ["i", "k", "b"] },
  k: { neighbors: ["j", "l"] },
  l: { neighbors: ["k", "m", "d"] },
  m: { neighbors: ["l", "m"] },
  n: { neighbors: ["m", "o", "f"] },
  o: { neighbors: ["n", "p"] },
  p: { neighbors: ["o", "i", "h"] },
};

const initialState: GameState = { turn: 0, stateGraph: initialStateGraph };

interface GameState {
  turn: number;
  stateGraph: StateGraph;
}

interface Action {
  type: ActionType;
}

type ActionType = "incrementTurn" | "decrementTurn";

function reducer(state: GameState, action: Action) {
  switch (action.type) {
    case "incrementTurn":
      return { ...state, turn: state.turn + 1 };
    case "decrementTurn":
      return { ...state, turn: state.turn - 1 };
    // TODO: Add actions which update stateGraph
    default:
      throw new Error(
        `Unsupported action in encountered in useGameState: ${action}`
      );
  }
}

export const useGameState = () => {
  return React.useReducer(reducer, initialState);
};
