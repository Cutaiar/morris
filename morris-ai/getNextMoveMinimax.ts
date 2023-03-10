import { GameState, Action, nextValidMoves, reducer } from "morris-core";
import { countMenOnBoard, partition } from "morris-core/utils";
import { NextMoveFunction } from "./types";

/** A "next move function" which uses an alphabeta pruned minimax tree along with
 * a tuned heuristic evaluation function to produce the optimal move for a given `state` of the game.
 *
 * Note: Eval function is incomplete and may not play very well.
 *
 * Based on: https://kartikkukreja.wordpress.com/2014/03/17/heuristicevaluation-function-for-nine-mens-morris/
 */
export const getNextMoveMinimax: NextMoveFunction = (state: GameState) => {
  return minimaxRoot(state).move;
};

/** Call minimax from here. Has the correct starting parameters and a built in depth limit. */
const minimaxRoot = (state: GameState): MinimaxReturn => {
  const mm = minimax(state, 6, true, -Infinity, Infinity);

  // If this is not a minimax return, move is undefined (see type guard), and an issue has occurred
  if (!isMinimaxReturn(mm)) {
    throw new Error("Minimax was unable to produce a valid move");
  }

  return mm;
};

/** The minimaxRoot function will return an evaluation of the best move as well as the move itself. */
type MinimaxReturn = {
  evaluation: number;
  move: Action;
};

/**
 * The minimax function will return an evaluation of each move as well as the move itself.
 * We need this type because at the leaf nodes of minimax recursion, we don't know the move to associate with the evaluation, nor is it necessary. */
type MinimaxRecursionReturn = {
  evaluation: number;
  move?: Action;
};

/** Type guard to distinguish recursion return vs root return */
function isMinimaxReturn(
  r: MinimaxReturn | MinimaxRecursionReturn
): r is MinimaxReturn {
  return (r as MinimaxReturn).move !== undefined;
}

/**
 * Classic minimax implemented for morris.
 * This is the underlying recursive fn.
 * To use minimax, call `minimaxRoot` above.
 *
 * @param state - the current state of the game
 * @param depth - depth we are at in recursion
 * @param maximizingPlayer - is this call for the maximizing player?
 * @param alpha - the alpha pruning bound
 * @param beta - the beta pruning bound
 */
const minimax = (
  state: GameState,
  depth: number,
  maximizingPlayer: boolean,
  alpha: number,
  beta: number
): MinimaxRecursionReturn => {
  // Leaf node, return the evaluation
  if (depth === 0 || state.winner) {
    return { evaluation: evaluation(state) };
  }

  // Get a list of the possible next moves. These are the children in the minimax tree
  const moves = nextValidMovesAsActions(state);

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = undefined;

    for (const move of moves) {
      const child = reducer(state, move);
      const mm = minimax(child, depth - 1, false, alpha, beta);
      // If this is the best evaluation seen so far, note this move as the best
      bestMove = mm.evaluation > maxEval ? move : bestMove;
      maxEval = Math.max(maxEval, mm.evaluation);

      // alphabeta prune
      alpha = Math.max(alpha, mm.evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return { evaluation: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    let bestMove = undefined;

    for (const move of moves) {
      const child = reducer(state, move);
      const mm = minimax(child, depth - 1, true, alpha, beta);

      // If this is the best evaluation seen so far, note this move as the best
      bestMove = mm.evaluation < minEval ? move : bestMove;
      minEval = Math.min(minEval, mm.evaluation);

      // alphabeta prune
      beta = Math.min(beta, mm.evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return { evaluation: minEval, move: bestMove };
  }
};

/**
 *
 * Get a list of the next possible actions given the current `state` of the game.
 *
 * Note, we need this conversion function because `nextValidMoves` from `morris-core` returns a simpler structure.
 * It gives is a `PointID[]` or `Record<PointID, PointID[]>` representing either possible placements, or possible moves.
 * Since we need to feed these possible moves into the `morris-core` `reducer` to obtain the states resulting from such moves, we need to turn these strings into actions.
 * This is the role of this function.
 *
 * TODO: Branching factor limit: 20?
 * TODO: Can we order these in a way that makes them more effective? Moves that are more likely to score highly should be first in the list.
 */
const nextValidMovesAsActions = (state: GameState): Action[] => {
  const moves = nextValidMoves(state);
  let actions: Action[] = [];

  if (state.turn.type === "remove") {
    actions = (moves as string[]).map((m) => {
      return { type: "remove", to: m };
    });
  } else {
    if (state.phase === 1) {
      actions = (moves as string[]).map((m) => {
        return { type: "place", to: m };
      });
    }

    if (state.phase === 2) {
      actions = Object.entries(moves as Record<string, string[]>).flatMap(
        (movesForMan) => {
          return movesForMan[1].map((m) => {
            return { type: "move", from: movesForMan[0], to: m };
          });
        }
      );
    }
  }
  return actions;
};

/**
 * The morris evaluation heuristic function for a given `state`
 *
 * Evaluation features (implemented as local functions)
 * 1. `ismill`: If move makes a mill
 * 2. `mills`: difference in # of mills
 * 3. `blocks`: difference in # of blocked men (men which don’t have an empty adjacent point)
 * 4. `men`: difference in # of men
 * 5. `2man`: difference in # of 2 man configurations (A 2-man configuration is one to which adding one more man would close a mill)
 * 6. `3man`: difference in # of 3 man configurations (A 3-man configuration is one to which a man can be added in which one of two ways to close a mill)
 * 7. `2mill`: difference in # of double mills (A double mill is one in which two mill share a common man)
 * 8. `win`: 1 if the state is winning for the player, -1 if losing, 0 otherwise
 */
const evaluation = (state: GameState) => {
  /** feature 1: if a mill was closed in the last move by the player, -1 if a mill was closed by the opponent in the last move, 0 otherwise*/
  const ismill = (state: GameState) => {
    return state.turn.type === "remove"
      ? state.turn.player === "a"
        ? 1
        : -1
      : 0;
  };

  /** feature 2: Difference in the amount of mills between player and  opponent */
  const mills = (state: GameState) => {
    const bothMills = partition(
      state.mills.filter((m) => m.occupancy !== undefined),
      (m) => m.occupancy === "a"
    );
    return bothMills[0].length - bothMills[1].length;
  };

  // feature 3: TODO

  /** feature 4: difference in the number of men between player and  opponent */
  const men = (state: GameState) => {
    const mine = countMenOnBoard(state, "a");
    const theirs = countMenOnBoard(state, "b");
    return mine - theirs;
  };

  // feature 5: TODO
  // feature 6: TODO
  // feature 7: TODO

  /** feature 8: 1 if the state is winning for the player, -1 if losing, 0 otherwise */
  const win = (state: GameState) => {
    switch (state.winner) {
      case "a":
        return 1;
      case "b":
        return -1;
      case undefined:
        return 0;
    }
  };

  switch (state.phase) {
    case 1: // Eval Phase 1 = 18 * (1) + 26 * (2) + 1 * (3) + 9 * (4) + 10 * (5) + 7 * (6)
      return 18 * ismill(state) + 26 * mills(state) + 9 * men(state);
    case 2: // Eval Phase 2 = 14 * (1) + 43 * (2) + 10 * (3) + 11 * (4) + 8 * (7) + 1086 * (8)
      return (
        14 * ismill(state) +
        43 * mills(state) +
        11 * men(state) +
        1086 * win(state)
      );
    case 3: // Eval Phase 3 = 16 * (1) + 10 * (5) + 1 * (6) + 1190 * (8)
      return 0; // TODO: Implement phase three eval when the game gets a phase 3
  }
};
