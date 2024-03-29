import { partition, countMenOnBoard } from "./utils";
import { initialStateNine } from "./initialState";
import {
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
  Turn
} from "./types";

/**
 * Given a player, get the opponent
 */
export const getOpponent = (player: Player): Player => {
  return player === "a" ? "b" : "a";
};

/**
 * Tell whether or not the selection of `pointID` is valid. To be used externally by UI to allow/disallow the selection of a point
 */
export const isValidSelection = (
  pointID: PointID,
  state: GameState
): boolean => {
  return state.stateGraph[pointID].occupancy === state.turn.player;
};

/**
 * Determine if the game state is in the next phase
 */
const isNextPhase = (state: GameState): boolean => {
  switch (state.phase) {
    // Phase 1 moves to phase 2 when there are no more remaining men
    case 1:
      return Object.values(state.remainingMen).every((rm) => rm === 0);

    // TODO: Phase 2 moves to phase 3 when...
    case 2:
      return false;

    // There is no phase 4, so the game can never advance from 3
    case 3:
      return false;

    // All phases were covered above, so if we get here, something went wrong
    default:
      throw new Error(
        `An invalid phase value of ${state.phase} was encountered in isNextPhase`
      );
  }
};

/**
 * Increment `phase`, throwing if an invalid increment was attempted
 */
const incrementPhase = (phase: Phase): Phase => {
  const nextPhase = phase + 1;

  // This range should match the range defined in the Phase type
  if (nextPhase > 3 || nextPhase < 1) {
    throw new Error(
      `An attempt to increment phase to ${nextPhase} was made. This is outside its valid range`
    );
  }
  return nextPhase as Phase;
};

/**
 * Check if the game has been won, return by whom, or undefined if not won.
 * Winning criterion:
 * - Opponent has 2 men on the board
 * - TODO Opponent has no legal move
 * Note: Should be called after all updates to game state that effect winning are made
 *
 * TODO: Can a win happen in phase 1? If so, it's a little harder to detect since initially, players have < 3 men as they place
 * especially if a third turn mill is formed and the opponent is reduced to 2 pieces
 */
const getWinner = (state: GameState) => {
  // We are explicitly disallowing a win in phase 1
  // TODO: Not sure if this is true to the game or not, but it causes issues at this point
  if (state.phase === 1) {
    return undefined;
  }

  // Count the number of men still on the board for a given occupancy

  // Do we need to generalize for n players?
  const players: Occupancy[] = ["a", "b"];

  // TODO Check for opponent has no legal move
  // For now, a winner opponent of the player with 2 men on the board
  const loser = players.find((player) => countMenOnBoard(state, player) < 3);
  // If there is no loser, there is no winner
  if (!loser) {
    return undefined;
  }

  // If there was as loser, the opponent is the winner
  return getOpponent(loser);
};

/**
 * Given the current state of the game, calculate the next mills
 * This includes:
 * - deactivating mills from the last turn
 * - activating and occupying mills formed this turn
 */
const nextMills = (state: GameState): Mill[] => {
  return state.mills.map((mill) => {
    // Grab the stateGraph occupancy of the first point in the mill
    const firstOcc = state.stateGraph[mill.points[0]].occupancy;

    // Lets see if the potential mill is still a mill
    // Do this by seeing if the stateGraph has the same occupancy as first (if defined) along the millLine
    const isMill = mill.points.every((pointID) => {
      return firstOcc && state.stateGraph[pointID].occupancy === firstOcc;
    });

    // Mill is still qualified
    if (isMill) {
      if (mill.occupancy) {
        // If this occupied mill is active, deactivate it, it must have been "used" already
        if (mill.active) {
          return { ...mill, active: undefined };
        }
        // If this occupied mill is not active, let it be, its just a "resting" mill
        return mill;
      }
      // Mill is not occupied
      else {
        // Bail is something weird happens
        if (mill.active) {
          throw new Error(
            "Found an active, unoccupied, but qualified mill when calculating next mills"
          );
        }
        // We found a new mill
        return { ...mill, occupancy: firstOcc, active: true };
      }
    }
    // Mill is not qualified
    else {
      // If this unqualified mill is still occupied, it must have been broken. It should no longer be occupied
      if (mill.occupancy) {
        return { ...mill, occupancy: undefined, active: undefined };
      }

      // Unqualified mill is not occupied
      else {
        // Bail is something weird happens
        if (mill.active) {
          throw new Error(
            "Found an active, unoccupied, unqualified mill when calculating next mills"
          );
        }
        // These are just potential mills that need no update
        return mill;
      }
    }
  });
};

/**
 * Tells whether `point` is part of an occupied mill
 */
const isPartOfMill = (point: PointID, state: GameState): boolean => {
  const occ = state.stateGraph[point].occupancy;

  // Point can't be part of an occupied mill if it is not occupied
  if (!occ) {
    return false;
  }

  return state.mills
    .filter((mill) => mill.points.some((p) => p === point)) // Interested in mills which contain the point in question
    .some((mill) => mill.occupancy === occ); // Any of the potential mills are occupied
};

/**
 * Given the game state, calculate the next turn.
 * This involves:
 * - deciding if the next turn is a removal turn
 * - who it goes to
 * - incrementing the count
 *
 * Note: `nextTurn` should be called on a game state which has already had its mills updated
 */
const nextTurn = (state: GameState): Turn => {
  const currentPlayer = state.turn.player;
  const opponent = getOpponent(currentPlayer);

  // Next turn is a removal if:
  // current turn is not a removal and
  // current player has an active mill
  const isRemoval =
    state.turn.type !== "remove" &&
    state.mills.some((mill) => mill.occupancy === currentPlayer && mill.active);

  return {
    ...state.turn,
    type: isRemoval ? "remove" : "regular",
    player: isRemoval ? currentPlayer : opponent,
    count: state.turn.count + 1
  };
};

/**
 * Validate a place action.
 * Expected scenarios:
 * - location must not be occupied
 *
 * Unexpected scenarios:
 * - current player must have >= 1 remaining man
 * - The game is not in phase 1
 */
const isValidPlace = (action: PlaceAction, state: GameState): boolean => {
  const currentPlayer = state.turn.player;
  return (
    state.stateGraph[action.to].occupancy === undefined &&
    state.remainingMen[currentPlayer] >= 1 &&
    state.phase === 1
  );
};

/**
 * Validate a move action.
 * Expected scenarios:
 * - location must not be occupied
 * - Can only move to adjacent spots
 * - Can only move the current players man
 * TODO - phase three has flying
 *
 * Unexpected scenarios:
 * - current player must have no remaining man
 * - The game is not in phase 2
 */
const isValidMove = (action: MoveAction, state: GameState): boolean => {
  const currentPlayer = state.turn.player;
  return (
    state.stateGraph[action.to].occupancy === undefined &&
    state.stateGraph[action.from].neighbors.includes(action.to) &&
    state.stateGraph[action.from].occupancy === currentPlayer &&
    state.remainingMen[currentPlayer] === 0 &&
    state.phase === 2
  );
};

/**
 * Validate a remove action.
 * Expected scenarios:
 * - location must be occupied
 * - Can only remove the opponents man
 * - Can only remove a man in a mill if there is no other option (mill removal caveat)
 *
 * Unexpected scenarios:
 * - turn must be of type removal
 */
const isValidRemove = (action: RemoveAction, state: GameState): boolean => {
  const occ = state.stateGraph[action.to].occupancy;
  return (
    occ !== undefined &&
    occ !== state.turn.player &&
    satisfiesMillRemovalCaveat(action, state) &&
    state.turn.type === "remove"
  );
};

/**
 * Represents  the following rule:
 *
 * "with the caveat that a piece in an opponent's mill can only be removed if no other pieces are available"
 *
 * returning whether of not the removal is valid according to this caveat
 */
const satisfiesMillRemovalCaveat = (
  action: RemoveAction,
  state: GameState
): boolean => {
  const opp = getOpponent(state.turn.player);

  // Split the stategraph into 2 arrays, one holding the points which are a part of an opponents occupied mill, and other not.
  const [milledOpponentPoints, nonMilledOpponentPoints] = partition(
    Object.keys(state.stateGraph).filter(
      (point) => state.stateGraph[point].occupancy === opp
    ),
    (point) => isPartOfMill(point, state)
  );

  // If the attempted removal is on a man in a mill
  if (milledOpponentPoints.includes(action.to)) {
    // Its valid only if there is no other man to take
    return nonMilledOpponentPoints.length === 0;
  }

  // If the attempted removal was not on a milled man, this rule is trivially satisfied
  return true;
};

/**
 * Validate an action in general
 */
export const isValidAction = (action: Action, state: GameState): boolean => {
  switch (action.type) {
    case "place":
      return isValidPlace(action, state);
    case "move":
      return isValidMove(action, state);
    case "remove":
      return isValidRemove(action, state);
    case "reset":
      return true;
  }
};

/** Calculate the next valid moves for a given gameState. These are useful for highlighting such moves during the game
 *
 * Note: Should be called on a state which has already had to/from, mills, turn and phase are updated
 *
 * Details:
 *
 * The next valid moves depends on the phase. Phase 1 has no selected piece,
 * so selection is not needed to calculate it. Valid placements are essentially just unoccupied spots.
 * In phase 2 however, the next valid moves depends on which piece you have selected. I chose to calculate the valid moves
 * for every piece that could be selected by the current player because it saves me from needing information from the board (the selected piece).
 * Alternatively, we can calculate valid moves at the time of selection, but this requires either removing nextMoves from gameState,
 * making it entirely a display concept, or having gameState be aware
 * of the players current selection (which seems like it should only be a display concept...)
 */
export const nextValidMoves = (
  state: GameState
): PointID[] | Record<PointID, PointID[]> => {
  // If its a removal, we already have a validator
  if (state.turn.type === "remove") {
    // curry the validator with the current state
    const cIsValidRemove = (to: PointID) =>
      isValidRemove({ type: "remove", to: to }, state);
    return Object.keys(state.stateGraph)
      .filter(cIsValidRemove)
      .map((p) => p[0]);
  }

  switch (state.phase) {
    case 1:
      // In phase 1, we just check all the spots on the board for ones which are a valid place
      // curry the validator with the current state
      const cIsValidPlace = (to: PointID) =>
        isValidPlace({ type: "place", to: to }, state);
      return Object.keys(state.stateGraph).filter((p) => cIsValidPlace(p));
    case 2:
      // In phase 2, only neighbors of the piece the player intends to move matter.
      // We calculate the valid moves for every man the current player could intend to move
      const pointsOccupiedByCurrentPlayer = Object.entries(
        state.stateGraph
      ).filter((kv) => kv[1].occupancy === state.turn.player);

      // curry the validator with the current state
      const cIsValidMove = (from: PointID, to: PointID) =>
        isValidMove({ type: "move", from: from, to: to }, state);

      // Map of points occupied by the current player to an array of points that are valid moves
      const validMovesByOccupiedPoint = Object.fromEntries<PointID[]>(
        pointsOccupiedByCurrentPlayer.map<[string, PointID[]]>((kv) => [
          kv[0],
          kv[1].neighbors.filter((n) => cIsValidMove(kv[0], n))
        ])
      );

      return validMovesByOccupiedPoint;
    case 3:
      return []; // TODO: Phase three is not supported yet, logic will eventually be a combination of phase 1 & 2
    default:
      throw new Error(
        `An invalid phase value of ${state.phase} was encountered in nextValidMoves`
      );
  }
};

const nextStateAfterPlace = (state: GameState, action: PlaceAction) => {
  const currentPlayer = state.turn.player;

  // Validate the place action
  // TODO: How do we communicate the correct thing to do?
  // TODO Should we validate before even allowing the action?
  if (!isValidPlace(action, state)) {
    console.warn("Invalid place action");
    return state;
  }

  // Update state with the action
  let nextState = {
    ...state,
    stateGraph: {
      ...state.stateGraph,
      // Occupy the "to" location with the player who made this play
      [action.to]: {
        ...state.stateGraph[action.to],
        occupancy: currentPlayer
      }
    },
    // Remove 1 man from the current players remaining men
    remainingMen: {
      ...state.remainingMen,
      [currentPlayer]: state.remainingMen[currentPlayer] - 1
    }
  };

  // Update the mills in game state
  nextState = { ...nextState, mills: nextMills(nextState) };

  // Update the turn (which is dependent on the updated mills)
  nextState = { ...nextState, turn: nextTurn(nextState) };

  // TODO: Check for win? Can you win in this phase?
  // I don't think so, and at this point, it causes issues to allow a win in phase 1
  // so we wont check for it here, and we will explicitly disallow it in `getWinner`

  // Check if the new state moves the game into the next phase
  nextState = isNextPhase(nextState)
    ? { ...nextState, phase: incrementPhase(state.phase) }
    : nextState;

  // Update the next valid moves (dependent on updated mills, turn, and phase)
  nextState = { ...nextState, nextMoves: nextValidMoves(nextState) };

  return nextState;
};

const nextStateAfterMove = (state: GameState, action: MoveAction) => {
  const currentPlayer = state.turn.player;

  // Validate the move action
  // TODO: How do we communicate the correct thing to do?
  // TODO Should we validate before even allowing the action?
  if (!isValidMove(action, state)) {
    console.warn("Invalid move action");
    return state;
  }

  // Update state with the action
  let nextState = {
    ...state,
    stateGraph: {
      ...state.stateGraph,
      // Occupy the "to" location with the player who made this play
      [action.to]: {
        ...state.stateGraph[action.to],
        occupancy: currentPlayer
      },
      [action.from]: {
        ...state.stateGraph[action.from],
        occupancy: undefined
      }
    }
  };

  // Update the mills in game state
  nextState = { ...nextState, mills: nextMills(nextState) };

  // Update the turn (which is dependent on the updated mills)
  nextState = { ...nextState, turn: nextTurn(nextState) };

  // Check to see if there is winner
  nextState = { ...nextState, winner: getWinner(nextState) };

  // Check if the next state moves the game into the next phase
  nextState = isNextPhase(nextState)
    ? { ...nextState, phase: incrementPhase(state.phase) }
    : nextState;

  // Update the next valid moves (dependent on updated mills, turn, and phase)
  nextState = { ...nextState, nextMoves: nextValidMoves(nextState) };

  return nextState;
};

const nextStateAfterRemove = (state: GameState, action: RemoveAction) => {
  // Validate the remove action
  // TODO: How do we communicate the correct thing to do?
  // TODO Should we validate before even allowing the action?
  if (!isValidRemove(action, state)) {
    console.warn("Invalid remove action");
    return state;
  }

  // Update state with the action
  let nextState = {
    ...state,
    stateGraph: {
      ...state.stateGraph,

      // Remove the man at "to" location
      [action.to]: {
        ...state.stateGraph[action.to],
        occupancy: undefined
      }
    }
  };

  // Update the mills in game state (because it is possible that this removal broke a mill)
  nextState = { ...nextState, mills: nextMills(nextState) };

  // Update the turn (which is dependent on the updated mills? Maybe not for a remove)
  nextState = { ...nextState, turn: nextTurn(nextState) };

  // Check to see if there is winner
  nextState = { ...nextState, winner: getWinner(nextState) };

  // Check if the new state moves the game into the next phase
  // TODO -- Do we need to do this here?
  nextState = isNextPhase(nextState)
    ? { ...nextState, phase: incrementPhase(state.phase) }
    : nextState;

  // Update the next valid moves (dependent on updated mills, turn, and phase)
  nextState = { ...nextState, nextMoves: nextValidMoves(nextState) };

  return nextState;
};

export const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    // A placement in phase 1
    case "place":
      return nextStateAfterPlace(state, action);
    // A move in phase 2
    case "move":
      return nextStateAfterMove(state, action);
    // A removal in the case a player made a mill and removes an opponents man
    case "remove":
      return nextStateAfterRemove(state, action);
    // We support resetting the game entirely
    case "reset":
      return action.state ?? initialStateNine;
    // If a different action came in here, bail
    default:
      throw new Error(
        `Unsupported action in encountered in useGameState: ${action}`
      );
  }
};
