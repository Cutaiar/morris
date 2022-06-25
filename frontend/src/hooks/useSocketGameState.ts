import React from "react";
import { useSocket } from "../context";
import { Action, GameState, Player, useGameState } from "./useGameState";

export const useSocketGameState = (): [
  GameState,
  React.Dispatch<Action>,
  Player | undefined
] => {
  const [gameState, updateGameState] = useGameState();
  const [player, setPlayer] = React.useState<Player | undefined>();
  const { socket } = useSocket();

  const socketUpdateGameState = (action: Action) => {
    console.log("emitting dispatch");
    socket?.emit("dispatch", action);
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("player", (player) => {
        console.log("connected");
        setPlayer(player);
      });

      socket.on("dispatch", (action) => {
        console.log("got dispatch");
        updateGameState(action);
      });
    }
  }, [socket, updateGameState]);

  return [gameState, socketUpdateGameState, player];
};
