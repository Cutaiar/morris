import { useState, useEffect } from "react";
import styled from "styled-components";

// Contexts
import { useSocket } from "context";

export const MultiplayerPanel = () => {
  const [socket] = useSocket();

  const [roomId, setRoomId] = useState<string>();
  const [roomToJoin, setRoomToJoin] = useState<string>();
  const [typingRoomId, setTypingRoomId] = useState(false);

  useEffect(() => {
    socket?.on("joined", (room) => {
      console.log("joined: " + room);
      setRoomId(room);
    });
  }, []);

  return (
    <Root>
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
    </Root>
  );
};

const randomRoomId = () =>
  Math.random().toString(36).substring(2, 4) +
  Math.random().toString(36).substring(2, 4);

const Root = styled.div`
  background-color: ${({ theme }) => theme.palette.neutralDark};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  height: fit-content;
  width: fit-content;
  padding: 20px;
  border-radius: 10px;
`;
