import React from "react";
import { useMount } from "react-use";
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
    socket.emit("dispatch", action);
  };

  useMount(() => {
    socket.on("player", (player) => {
      console.log("connected");
      setPlayer(player);
    });

    socket.on("dispatch", (action) => {
      console.log("got dispatch");
      updateGameState(action);
    });
  });

  return [gameState, socketUpdateGameState, player];
};
