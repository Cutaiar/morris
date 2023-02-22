import { Action, GameState } from "morris-core";

/** A function which takes the current game state and returns an action to be executed */
export type NextMoveFunction = (state: GameState) => Action | undefined;

/** We currently have 3 types of AI */
export type AIID = "rand" | "smart" | "minimax";
