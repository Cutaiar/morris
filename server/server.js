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

io.on("connection", function (socket) {
  console.log("player connected");
  if (players["a"] == null) {
    players["a"] = socket;
    socket.emit("player", "a");
  } else if (players["b"] == null) {
    players["b"] = socket;
    socket.emit("player", "b");
  } else {
    socket.disconnect();
  }

  socket.on("disconnect", function () {
    if (players["a"] === socket) {
      players["a"] = null;
    } else if (players["b"] === socket) {
      players["b"] = null;
    }
  });

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
    console.log("echoing dispatch");
    // just echo the dispatch out to all the players
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
