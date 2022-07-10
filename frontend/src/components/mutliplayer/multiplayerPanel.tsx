import React from "react";

// Contexts
import { useSocket } from "context";

export const MultiplayerPanel = () => {
  const [socket] = useSocket();

  const [roomId, setRoomId] = React.useState<string>();
  const [roomToJoin, setRoomToJoin] = React.useState<string>();
  const [typingRoomId, setTypingRoomId] = React.useState(false);

  React.useEffect(() => {
    socket?.on("joined", (room) => {
      console.log("joined: " + room);
      setRoomId(room);
    });
  }, []);

  return (
    <div className="MPPanel">
      {roomId ? (
        "Room: " + roomId
      ) : (
        <>
          <button
            onClick={() => {
              const id = randomRoomId();
              socket?.emit("createRoom", id);
            }}
          >
            Create Room
          </button>

          {typingRoomId ? (
            <>
              <input
                type={"text"}
                value={roomToJoin}
                onChange={(e) => setRoomToJoin(e.target.value)}
              ></input>
              <button onClick={() => socket?.emit("join", roomToJoin)}>
                Join Room
              </button>
            </>
          ) : (
            <button onClick={() => setTypingRoomId(true)}>Join Room</button>
          )}
        </>
      )}
    </div>
  );
};

const randomRoomId = () =>
  Math.random().toString(36).substring(2, 4) +
  Math.random().toString(36).substring(2, 4);
