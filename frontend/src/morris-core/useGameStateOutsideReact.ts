import { reducer, initialStateSix, Action } from "morris-core";

var state = initialStateSix;

/**
 * Exactly like `useGameState` but does not rely on reacts `useReducer`. It keeps state in a file scope var.
 *
 * // TODO: Does this work? Does closures break it?
 * // TODO: Generalize to `useReducerOutsideReact(reducer)`
 */
export const useGameStateOutsideReact = () => {
  const update = (action: Action) => reducer(state, action);
  return [state, update];
};
