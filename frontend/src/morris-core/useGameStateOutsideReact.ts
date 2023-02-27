import { reducer, Action } from "morris-core/";
import { initialStateSix } from "./initialState";

// For now just use initial state 6 until we determine if we want to pass in game size
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
