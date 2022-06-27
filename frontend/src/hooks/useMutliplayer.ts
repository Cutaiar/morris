import React from "react";

import { useSocket } from "../context";

import { Player } from "./useGameState";

export const useMultiplayer = (
  onOpponentConnected?: () => void
): [() => Promise<Player>] => {
  const [socket, connectSocket] = useSocket();

  // So far, this is the canonical way to set up a listener on a socket state
  React.useEffect(() => {
    if (socket && !socket.hasListeners("opponentConnected")) {
      socket.on("opponentConnected", () => onOpponentConnected?.());
    }
  }, [socket, onOpponentConnected]);

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
