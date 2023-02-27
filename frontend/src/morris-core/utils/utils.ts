import { GameState, Occupancy } from "../types";

// File contains utils specific to the `morris-core` project. Though users of this project may still import and use these utils from `morris-core/utils`

/**
 * Given a `state`, count the men on the board for a given `occupancy`.
 * TODO: Maybe make occupancy optional to count both
 */
export const countMenOnBoard = (state: GameState, occupancy: Occupancy) =>
  Object.values(state.stateGraph).reduce((accumulator, point) => {
    if (point.occupancy === occupancy) {
      return accumulator + 1;
    }

    return accumulator;
  }, 0);

/**
 * Use like Array.filter, but get a handle on the elements "filtered out"
 * TODO: Use generics
 */
export const partition = (
  array: any[],
  predicate: (e: any) => boolean
): [any, any] => {
  return array.reduce(
    ([pass, fail], elem) => {
      return predicate(elem)
        ? [[...pass, elem], fail]
        : [pass, [...fail, elem]];
    },
    [[], []]
  );
};

/**
 * Pick a random property of `obj`
 */
export function getRandomProperty(obj: {}) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Get a random element from an array
 */
export const getRandomElement = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
