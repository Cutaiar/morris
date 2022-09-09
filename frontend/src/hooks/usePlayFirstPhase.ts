import { getRandomProperty } from "utils";
import { Action, GameState } from "./useGameState";

// TODO: does not work, get called infinitely since game state seems not to update
export const usePlayFirstPhase = (
  gameState: GameState,
  updateGameState: React.Dispatch<Action>
) => {
  const func = () => {
    const makeRandomPlace = () =>
      updateGameState({
        type: "place",
        to: getRandomProperty(gameState.stateGraph),
      });

    makeRandomPlace();
    const interval = setInterval(function () {
      if (Object.values(gameState.remainingMen).some((rm) => rm !== 0)) {
        makeRandomPlace();
      } else {
        clearInterval(interval);
      }
    }, 100);
  };
  return func;
};
