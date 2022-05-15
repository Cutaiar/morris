import React from "react";

type Player = "a" | "b";
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
  turn: { count: 0, player: "a" },
  stateGraph: initialStateGraph,
};

export interface GameState {
  turn: { count: number; player: Player };
  stateGraph: StateGraph;
}

export interface PlayAction extends BaseAction {
  type: "play";
  from: PointID;
  to: PointID;
}

interface ResetAction extends BaseAction {
  type: "reset";
}

type ActionType = "play" | "reset";
interface BaseAction {
  type: ActionType;
}

type Action = PlayAction | ResetAction;

const otherPlayer = (player: Player): Player => {
  return player === "a" ? "b" : "a";
};

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "play":
      const player = state.turn.player;
      // TODO: check for win
      return {
        stateGraph: {
          ...state.stateGraph,

          // Occupy the "to" location with the player who made this play
          // TODO: make sure to move the from and check that it was valid
          [action.to]: {
            ...state.stateGraph[action.to],
            occupancy: player,
          },
        },
        // When a play is made, the count increments and it becomes the other players turn
        turn: {
          player: otherPlayer(player),
          count: state.turn.count + 1,
        },
      };
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
