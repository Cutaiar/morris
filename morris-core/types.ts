export type Phase = 1 | 2 | 3;
export type Player = "a" | "b";
export type Occupancy = Player;
export type PointID = string;
export type Point = {
  neighbors: PointID[];
  occupancy?: Occupancy;
};
export type StateGraph = Record<PointID, Point>;

export type Turn = {
  count: number;
  player: Player;
  type: "remove" | "regular";
};

export interface Mill {
  points: PointID[];
  occupancy?: Occupancy;
  active?: boolean;
}
export interface GameState {
  phase: Phase;
  turn: Turn;
  remainingMen: Record<Player, number>;
  stateGraph: StateGraph;
  mills: Mill[];
  winner?: Player;
  nextMoves: PointID[] | Record<PointID, PointID[]>;
}

export interface BaseAction {
  type: ActionType;
}

export interface PlaceAction extends BaseAction {
  type: "place";
  to: PointID;
}

export interface MoveAction extends BaseAction {
  type: "move";
  from: PointID;
  to: PointID;
}

export interface RemoveAction extends BaseAction {
  type: "remove";
  to: PointID;
}

/** Reset the game to the initial state. If `state` is given, reset to that state instead. */
export interface ResetAction extends BaseAction {
  type: "reset";
  state?: GameState;
}

export type ActionType = "place" | "move" | "remove" | "reset";

export type Action = PlaceAction | MoveAction | RemoveAction | ResetAction;
