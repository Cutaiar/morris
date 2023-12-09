// Generate initial states

import { GameState, Mill, PointID, StateGraph } from "../types";

const numberOfPointsInRing = 8;

/**
 * How many men per ring? Based on 6 and 9 man morris, this should be 3. Maybe the pattern is not this regular though? Use an object instead?
 */
const ringManMultiplier = 3;

/**
 * Generate an initial state for a game of morris with any number of rings.
 */
export const generate = (numberOfRings: number): GameState => {
  const sg = generateStateGraph(numberOfRings);
  const numberOfMen = numberOfRings * ringManMultiplier;
  return {
    phase: 1,
    turn: { count: 0, player: "a", type: "regular" },
    stateGraph: sg,
    remainingMen: { a: numberOfMen, b: numberOfMen },
    mills: generateMills(sg),
    winner: undefined,
    nextMoves: Object.keys(sg)
  };
};

/**
 * Generate a list of ids which will be assigned to the stategraph.
 * a-z, then aa-zz, then aaa-zzz.
 * This is not the only way to do ids, maybe guids or integers would be better.
 */
const generateIds = (numberOfRings: number) => {
  const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  const wrap = alphabet.length;
  let ids = [];
  const numIdsNeeded = numberOfRings * numberOfPointsInRing;

  for (let i = 0; i < numIdsNeeded; i++) {
    const rep = Math.floor(i / wrap) + 1;
    ids.push(alphabet[i % wrap].repeat(rep));
  }
  return ids;
};

/**
 * Generate a state graph with a certain number of rings
 */
const generateStateGraph = (numberOfRings: number): StateGraph => {
  const numberOfPoints = numberOfPointsInRing * numberOfRings;

  // Generate a list of ids that will be assigned to the points in the stategraph
  const ids = generateIds(numberOfRings);

  // Assign ids to stategraph inner to outer, starting top left point going clockwise
  let i = 0;
  let stateGraph: StateGraph = {};
  while (i < numberOfPoints) {
    const ring = Math.floor(i / numberOfPointsInRing);

    // calc neighbors
    let n: PointID[] = [];
    if (i % numberOfPointsInRing === 0) {
      n = [ids[i + 1], ids[i + numberOfPointsInRing - 1]];
    } else if (i === numberOfPointsInRing * (ring + 1) - 1) {
      n = [ids[i - 1], ids[i - numberOfPointsInRing + 1]];
    } else {
      n = [ids[i - 1], ids[i + 1]];
    }

    stateGraph[ids[i]] = { neighbors: n };
    i++;
  }

  // Connect midpoints of edges of rings
  const chunks = spliceIntoChunks(
    Object.keys(stateGraph),
    numberOfPointsInRing
  );
  const midPointChunks = chunks.map((chunk) =>
    chunk.filter((e, i) => i % 2 !== 0)
  );

  midPointChunks.forEach((chunk, i) => {
    // connect the chunks to the left and right of this chunk to each other
    const inner = midPointChunks[i - 1];
    const outer = midPointChunks[i + 1];
    inner && connect(stateGraph, chunk, inner);
    outer && connect(stateGraph, chunk, outer);
  });

  return stateGraph;

  // Example SG
  //   {
  //     // inner ring
  //     a: { neighbors: ["b", "h"] },
  //     b: { neighbors: ["a", "c", "j"] },
  //     c: { neighbors: ["b", "d"] },
  //     d: { neighbors: ["c", "e", "l"] },
  //     e: { neighbors: ["d", "f"] },
  //     f: { neighbors: ["e", "g", "n"] },
  //     g: { neighbors: ["f", "h"] },
  //     h: { neighbors: ["g", "a", "p"] },

  //     // outer ring
  //     i: { neighbors: ["j", "p"] },
  //     j: { neighbors: ["i", "k", "b", "r"] },
  //     k: { neighbors: ["j", "l"] },
  //     l: { neighbors: ["k", "m", "d", "t"] },
  //     m: { neighbors: ["l", "n"] },
  //     n: { neighbors: ["m", "o", "f", "v"] },
  //     o: { neighbors: ["n", "p"] },
  //     p: { neighbors: ["o", "i", "h", "x"] },

  //     // final ring
  //     q: { neighbors: ["r", "x"] },
  //     r: { neighbors: ["q", "s", "j"] },
  //     s: { neighbors: ["r", "t"] },
  //     t: { neighbors: ["s", "u", "l"] },
  //     u: { neighbors: ["t", "v"] },
  //     v: { neighbors: ["u", "w", "n"] },
  //     w: { neighbors: ["v", "x"] },
  //     x: { neighbors: ["w", "q", "p"] },
  //   };
};

/**
 * Generate mills from a stategraph with ordering assumption. I don't even want to talk about it
 * TODO: cross ring mills are not calculated here, a bit sticky when ring count is large
 */
const generateMills = (sg: StateGraph): Mill[] => {
  // Note: we will rely on the ordering of the sg object. We assume that it is alphabetical.
  // I have read that you can't rely on the order, if this is true, just sort the keys before using them!
  const keys = Object.keys(sg);
  const numberOfPoints = keys.length;
  const numberOfRings = numberOfPoints / numberOfPointsInRing;

  const lengthOfMill = 3;
  const numberOfMillsInRing = 4;

  let final: Mill[] = [];
  let arr: string[] = [];
  let i = 0;
  while (final.length < numberOfMillsInRing * numberOfRings) {
    if (arr.length === lengthOfMill) {
      final.push({ points: [...arr] });
      arr = [];
      i--;
    }

    // Which ring are we on?
    const ring = Math.floor(i / numberOfPointsInRing);

    // 4th time and 8th time, 12th time, i want to wrap -- add first key in ring rather than current i
    if (
      final.length < ring * numberOfMillsInRing &&
      i !== 0 &&
      i % numberOfPointsInRing === 0
    ) {
      arr.push(keys[i - numberOfPointsInRing]);
    } else {
      arr.push(keys[i % keys.length]);
    }
    i++;
  }
  return final;

  // Example mills
  //    [
  //     // inner ring
  //     { points: ["a", "b", "c"] },
  //     { points: ["c", "d", "e"] },
  //     { points: ["e", "f", "g"] },
  //     { points: ["g", "h", "a"] },

  //     // outer ring
  //     { points: ["i", "j", "k"] },
  //     { points: ["k", "l", "m"] },
  //     { points: ["m", "n", "o"] },
  //     { points: ["o", "p", "i"] },

  //     // final ring
  //     { points: ["q", "r", "s"] },
  //     { points: ["s", "t", "u"] },
  //     { points: ["u", "v", "w"] },
  //     { points: ["w", "x", "q"] },
  //   ];
};

/**
 * Helper to split an array into evenly sized chunks
 */
const spliceIntoChunks = (arr: any[], chunkSize: number) => {
  const res = [];
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
};

/**
 * Take the stategraph, and two same sized arrays of nodes that are connected corresponding by index (i.e. arr[0] <-> other[0] for all i)
 */
const connect = <T extends string>(sg: StateGraph, arr: T[], other: T[]) => {
  // connect other to arr
  arr.forEach((k, i) => {
    sg[k] = { ...sg[k], neighbors: [...sg[k].neighbors, other[i]] };
  });
};
