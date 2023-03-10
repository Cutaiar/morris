import React from "react";
import { io, Socket } from "socket.io-client";

// TODO: switch between dev and prod dynamically
// const uri = "http://localhost:1337";
// const uri = "https://morris-socket-server.herokuapp.com";
const uri = "https://morris-socket-server.onrender.com";

interface SocketContextValue {
  socket?: Socket;
  connect: (query?: SocketQuery) => Socket;
}

type SocketQuery = { [key: string]: any } | undefined;

const SocketContext = React.createContext<SocketContextValue | undefined>(
  undefined
);

/**
 * Provides access to the socket object produced when the SocketProvider connected
 */
export const useSocket = (): [
  Socket | undefined,
  (query?: SocketQuery) => Socket
] => {
  const sc = React.useContext(SocketContext);
  if (!sc) {
    throw new Error("No SocketProvider found when calling useSocket");
  }
  return [sc.socket, sc.connect];
};

/**
 * Connects to a socket using socket.io
 */
export const SocketProvider = (props: React.PropsWithChildren<{}>) => {
  const [socket, setSocket] = React.useState<Socket | undefined>();

  const connect = (query?: SocketQuery) => {
    const socket = io(uri, query ? { query } : undefined);
    setSocket(socket);
    return socket;
  };

  return (
    <SocketContext.Provider value={{ socket: socket, connect }}>
      {props.children}
    </SocketContext.Provider>
  );
};
