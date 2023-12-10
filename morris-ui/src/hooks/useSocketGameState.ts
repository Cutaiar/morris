import * as React from "react";
import { useSocket } from "context";
import { Action, GameState, useGameState } from "./useGameState";

/**
 * Exactly the same as useGameState, but will route dispatches through the socket context,
 * emitting them and then listening for their echo before dispatching the action to local state.
 * This way, players connected to the server get each others dispatches.
 *
 * Note: Must be used in a `SocketProvider`.
 */
export const useSocketGameState = (): [GameState, React.Dispatch<Action>] => {
  const [gameState, updateGameState] = useGameState();
  const [socket] = useSocket();

  const socketUpdateGameState = (action: Action) => {
    console.log("emitting dispatch");
    socket?.emit("dispatch", action);
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("dispatch", (action) => {
        console.log("received dispatch from server");
        updateGameState(action);
      });
    }
  }, [socket, updateGameState]);

  return [gameState, socketUpdateGameState];
};
