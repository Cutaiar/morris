import React from "react";
import { getNextMoveRandom } from "morris-ai";
import { Action, GameState, reducer } from "morris-core";

/** Function returned by this hook will play quickly through phase 1 of the game when called. CALL ONCE.
 * ⚠️: TODO -- does not work, get called infinitely since game state seems not to update
 */
export const usePlayFirstPhase = (
  gameState: GameState,
  updateGameState: React.Dispatch<Action>
) => {
  const lastInterval = React.useRef<ReturnType<typeof setTimeout>>();

  const [gs, setGS] = React.useState(gameState);
  const func = () => {
    const makeRandomMove = (gs: GameState) => {
      const move = getNextMoveRandom(gs);
      updateGameState(move);
      setGS(reducer(gs, move)); // It is redundant to calculate this twice, but this is a debug tool anyway
    };

    makeRandomMove(gs);
    lastInterval.current = setInterval(function () {
      const shouldMakeMove = gs.phase === 1;
      if (shouldMakeMove) {
        makeRandomMove(gs);
      } else {
        console.log("done"); // never happens
        lastInterval.current && clearInterval(lastInterval.current);
      }
    }, 100);
  };
  return func;
};

/** Function returned by this hook will play instantly through phase 1 of the game when called*/
export const useBuildSkipPhaseOneFunc = (
  updateGameState: React.Dispatch<Action>
) => {
  const func = () => {
    updateGameState({ type: "reset", state: targetGameState });
  };
  return func;
};

/** This is the gameState we will be resetting to. This is a game just after phase 1 was finished, copied using the the debug output of the app. */
const targetGameState: GameState = {
  phase: 2,
  turn: {
    count: 19,
    player: "a",
    type: "regular"
  },
  stateGraph: {
    a: {
      neighbors: ["b", "h"],
      occupancy: "b"
    },
    b: {
      neighbors: ["a", "c", "j"],
      occupancy: "b"
    },
    c: {
      neighbors: ["b", "d"],
      occupancy: "a"
    },
    d: {
      neighbors: ["c", "e", "l"],
      occupancy: "a"
    },
    e: {
      neighbors: ["d", "f"]
    },
    f: {
      neighbors: ["e", "g", "n"],
      occupancy: "b"
    },
    g: {
      neighbors: ["f", "h"],
      occupancy: "a"
    },
    h: {
      neighbors: ["g", "a", "p"],
      occupancy: "a"
    },
    i: {
      neighbors: ["j", "p"],
      occupancy: "b"
    },
    j: {
      neighbors: ["i", "k", "b", "r"]
    },
    k: {
      neighbors: ["j", "l"],
      occupancy: "a"
    },
    l: {
      neighbors: ["k", "m", "d", "t"],
      occupancy: "a"
    },
    m: {
      neighbors: ["l", "n"]
    },
    n: {
      neighbors: ["m", "o", "f", "v"],
      occupancy: "a"
    },
    o: {
      neighbors: ["n", "p"]
    },
    p: {
      neighbors: ["o", "i", "h", "x"],
      occupancy: "b"
    },
    q: {
      neighbors: ["r", "x"]
    },
    r: {
      neighbors: ["q", "s", "j"],
      occupancy: "b"
    },
    s: {
      neighbors: ["r", "t"],
      occupancy: "a"
    },
    t: {
      neighbors: ["s", "u", "l"],
      occupancy: "b"
    },
    u: {
      neighbors: ["t", "v"]
    },
    v: {
      neighbors: ["u", "w", "n"],
      occupancy: "a"
    },
    w: {
      neighbors: ["v", "x"],
      occupancy: "b"
    },
    x: {
      neighbors: ["w", "q", "p"],
      occupancy: "b"
    }
  },
  remainingMen: {
    a: 0,
    b: 0
  },
  mills: [
    {
      points: ["a", "b", "c"]
    },
    {
      points: ["c", "d", "e"]
    },
    {
      points: ["e", "f", "g"]
    },
    {
      points: ["g", "h", "a"]
    },
    {
      points: ["i", "j", "k"]
    },
    {
      points: ["k", "l", "m"]
    },
    {
      points: ["m", "n", "o"]
    },
    {
      points: ["o", "p", "i"]
    },
    {
      points: ["q", "r", "s"]
    },
    {
      points: ["s", "t", "u"]
    },
    {
      points: ["u", "v", "w"]
    },
    {
      points: ["w", "x", "q"]
    },
    {
      points: ["b", "j", "r"]
    },
    {
      points: ["d", "l", "t"]
    },
    {
      points: ["f", "n", "v"]
    },
    {
      points: ["h", "p", "x"]
    }
  ],
  nextMoves: {
    c: [],
    d: ["e"],
    g: [],
    h: [],
    k: ["j"],
    l: ["m"],
    n: ["m", "o"],
    s: [],
    v: ["u"]
  }
};
