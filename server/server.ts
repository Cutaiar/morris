//Todo: use TS: https://socket.io/docs/v4/typescript/

import { Socket } from "socket.io";

import { createServer } from "http";
import { Server } from "socket.io";

interface Players {
  a: Socket | null;
  b: Socket | null;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const players: Players = { a: null, b: null };

/**
 * When a player connects to the server, we store them in `players`.
 * The first player to connect is a, second is b.
 *
 * We then emit the connected event, letting the player know if they are a or b.
 * Emit an opponentConnected event to let the other player know when they have an opponent
 */
io.on("connection", function (socket: Socket) {
  // TODO player should tell us who they are

  if (players.a == null) {
    players.a = socket;
    console.log("a connected");
    socket.emit("connected", "a");
  } else if (players["b"] == null) {
    players.b = socket;
    console.log("b connected");
    socket.emit("connected", "b");
    socket.emit("opponentConnected"); // Tell b that a is already connected
    players.a.emit("opponentConnected"); // Tell a that b connected
  } else {
    socket.disconnect();
  }

  /**
   * If the player disconnects
   */
  socket.on("disconnect", function () {
    if (players["a"] === socket) {
      players["a"] = null;
    } else if (players["b"] === socket) {
      players["b"] = null;
    }
  });

  /**
   * For now, the frontend will emit a "dispatch" event when there is a reducer dispatch,
   * and the server will just echo it. This way, dispatches are shared between players.
   *
   * In the future, we will store the reducer here for persistent state?
   */
  socket.on("dispatch", function (action) {
    // Ignore players clicking when it's not their turn
    // if (players[player] !== socket) {
    //   console.log("dispatch from wrong player: " + player === "a" ? "b" : "a");
    //   return;
    // }

    // Ignore clicks before both players are connected
    if (players["a"] == null || players["b"] == null) {
      console.log("dispatch before all players are connected");
      return;
    }

    // just echo the dispatch out to all the players
    console.log("echoing dispatch");
    io.emit("dispatch", action);
  });

  // These two events from from the room joining infra
  socket.on("createRoom", (room) => {
    socket.join(room);
    socket.emit("joined", room);
  });

  socket.on("join", (room) => {
    socket.join(room);
    socket.emit("joined", room);
  });
});

const port = process.env.PORT || 1337;
httpServer.listen(port);
console.log("Listening on port " + port + "...");
