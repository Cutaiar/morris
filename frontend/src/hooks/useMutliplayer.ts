import React from "react";

import { useSocket } from "../context";

import { Player } from "./useGameState";

export const useMultiplayer = (): [() => Promise<Player>] => {
  const [socket, connectSocket] = useSocket();

  const connect = () => {
    const s = connectSocket();
    return new Promise<Player>((resolve) => {
      s.on("connected", (player) => {
        console.log("connected: " + player);
        resolve(player);
      });
    });
  };

  return [connect];
};
