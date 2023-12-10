import { useEffect } from "react";
import { useSocket } from "context";
import { Player } from "./useGameState";

// TODO should be shared with the server
interface OpponentInfo {
  name?: string;
  player: Player;
}

export const useMultiplayer = (
  onOpponentConnected?: (opponentInfo: OpponentInfo) => void
): [(name?: string) => Promise<Player>] => {
  const [socket, connectSocket] = useSocket();

  // So far, this is the canonical way to set up a listener on a socket state
  useEffect(() => {
    if (socket && !socket.hasListeners("opponentConnected")) {
      socket.on("opponentConnected", (info: OpponentInfo) =>
        onOpponentConnected?.(info)
      );
    }
  }, [socket, onOpponentConnected]);

  const connect = (name?: string) => {
    const s = connectSocket(name ? { name } : undefined);
    return new Promise<Player>((resolve) => {
      s.on("connected", (player: Player) => {
        console.log("connected: " + player);
        resolve(player);
      });
    });
  };

  return [connect];
};
