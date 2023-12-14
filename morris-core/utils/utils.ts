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
 * TODO: named array return?
 */
export const partition = <T>(
  array: T[],
  predicate: (e: T) => boolean
): [T[], T[]] => {
  return array.reduce(
    (acc: [T[], T[]], elem) => {
      const [pass, fail] = acc;
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
export function getRandomProperty<T>(obj: Record<string, T>): string {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Pick a random value of `obj`
 */
export function getRandomValue<T>(obj: Record<string, T>): T {
  const values = Object.values(obj);
  return values[Math.floor(Math.random() * values.length)];
}

/**
 * Get a random element from an array
 */
export const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};
