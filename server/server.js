//Todo: use TS: https://socket.io/docs/v4/typescript/

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const players = { a: null, b: null };
let player = "a";

function reset() {
  // todo dispatch reset action
}

/**
 * When a player connects to the server, we store them in `players`.
 * The first player to connect is a, second is b.
 *
 * We then emit the connected event, letting the player know if they are a or b.
 */
io.on("connection", function (socket) {
  // TODO player should tell us who they are
  console.log("player connected");

  if (players["a"] == null) {
    players["a"] = socket;
    socket.emit("connected", "a");
  } else if (players["b"] == null) {
    players["b"] = socket;
    socket.emit("connected", "b");
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

reset();
const port = 1337;
httpServer.listen(port);
console.log("Listening on port " + port + "...");
