import React from "react";
import { reducer, initialStateSix } from "morris-core";

/**
 * A reducer-like hook which holds the entire state of the game
 */
export const useGameState = () => {
  return React.useReducer(reducer, initialStateSix);
};

// For back compat with existing imports in the front end
export * from "morris-core";
