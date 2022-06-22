import React from "react";
import { io, Socket } from "socket.io-client";

// TODO: This will have to change
const uri = "http://localhost:1337";

interface SocketContextValue {
  socket: Socket;
}

const SocketContext = React.createContext<SocketContextValue | undefined>(
  undefined
);

/**
 * Provides access to the socket object produced when the SocketProvider connected
 */
export const useSocket = () => {
  const sc = React.useContext(SocketContext);
  if (!sc) {
    throw new Error("No SocketProvider found when calling useSocket");
  }
  return sc;
};

/**
 * Connects to a socket using socket.io
 */
export const SocketProvider = (props: React.PropsWithChildren<{}>) => {
  const [socket, _] = React.useState(() => io(uri));

  return (
    <SocketContext.Provider value={{ socket: socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
