export * from "./morrisReducer";
// cant do this, huh
// https://github.com/microsoft/TypeScript/issues/37238
// export type * from "./types";
export type {
  Action,
  GameState,
  Mill,
  MoveAction,
  Occupancy,
  Phase,
  PlaceAction,
  Player,
  PointID,
  RemoveAction,
  StateGraph,
  Turn,
  Point,
} from "./types";

export { useGameStateOutsideReact } from "./useGameStateOutsideReact";
