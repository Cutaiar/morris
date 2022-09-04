import React from "react";
import { reducer } from "morris-core";
import { generate } from "morris-core/initialState";

/**
 * A reducer-like hook which holds the entire state of the game
 */
export const useGameState = () => {
  return React.useReducer(reducer, 2, generate);
};

// For back compat with existing imports in the front end
export * from "morris-core";
