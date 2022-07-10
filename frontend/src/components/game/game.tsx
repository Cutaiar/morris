import React from "react";

// Components
import {
  Button,
  PlayerCard,
  WinnerModal,
  DebugGameState,
  TopNav,
  Opponent,
  Board,
  OpponentSelector,
  OpponentType,
  Loader,
} from "components";

// Hooks
import {
  useDebug,
  useMultiplayer,
  usePrefs,
  useSocketGameState,
  useGameState,
} from "hooks";
import { useMount } from "react-use";

// Style
import { palette } from "theme";

// TODO this should import from somewhere else
import { Player } from "hooks/useGameState";

const defaultOpponentName = "Opponent";

export const Game = () => {
  // TODO: Figure out how to switch between online state and non-online state
  const [socketGameState, updateSocketGameState] = useSocketGameState();
  const [localGameState, updateLocalGameState] = useGameState();

  // Get multiplayer functionalities
  const [connect] = useMultiplayer((opponentInfo) => {
    console.log("opponent connected");
    setOpponentName(opponentInfo.name ?? "Anonymous Opp.");
    setOpponent(opponentInfo.player);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debug, _, syncDebug] = useDebug();
  useMount(() => syncDebug());

  // If advanced controls are open or not
  const [isAdvanced, setIsAdvanced] = React.useState(false);

  // Whether the opponent is controlled by the keyboard or not
  const [opponentType, setOpponentType] = React.useState<
    OpponentType | undefined
  >(undefined);

  const [player, setPlayer] = React.useState<Player | undefined>(undefined);
  const [opponent, setOpponent] = React.useState<Player | undefined>(undefined);
  const [opponentName, setOpponentName] = React.useState<string | undefined>(
    undefined
  );

  const [prefs, setPref] = usePrefs();
  const mute = prefs.mute;
  const setMute = (mute: boolean) => setPref("mute", mute);
  const name = prefs.name ?? "Me";

  // Online related construction
  // - tell socket context to connect
  // - TODO: Somehow use networked game state rather than local game state (just keep both for now)
  // - set the player when the player event comes back
  // const player = opponentType === "online" ? playerFromSocket : "a";
  const gameState =
    opponentType === "online" ? socketGameState : localGameState;
  const updateGameState =
    opponentType === "online" ? updateSocketGameState : updateLocalGameState;

  const [connecting, setConnecting] = React.useState(false);
  const handleOpponentSelected = async (type: OpponentType) => {
    if (type === "online") {
      setOpponentType(type);
      if (!connecting) {
        console.log("connecting");
        setConnecting(true);
        const player = await connect(name);
        setPlayer(player);
        setConnecting(false);
        return;
      }
      return;
    }
    setOpponentType(type);
    setOpponentName(defaultOpponentName);
    setOpponent("b");
    setPlayer("a");
  };

  return (
    <div className="App">
      <TopNav />
      <div className="Page">
        <div className="Controls">
          {!opponentType && (
            <OpponentSelector onDecision={handleOpponentSelected} />
          )}
          {opponentType && (
            <PlayerCard
              player={opponent}
              remove={gameState.turn.type === "remove"}
              turn={gameState.turn.player}
              name={opponentName ?? "..."}
              remainingMen={
                opponent ? gameState.remainingMen[opponent] : undefined
              }
            />
          )}
          {((opponentType === "online" && !opponent) || connecting) && (
            <Loader text="waiting for opponent..." />
          )}
          {opponent && opponentType === "ai" && (
            <Opponent
              state={gameState}
              player={opponent}
              updateGameState={updateGameState}
              sound={!mute}
            />
          )}
          {opponentType === "local" && (
            <label style={{ fontSize: "medium", color: palette.neutral }}>
              opponent is local
            </label>
          )}
        </div>

        {/* We need to use the adjacency in gameState to assign ids to the elements drawn by this component */}
        <Board
          gameState={gameState}
          onPlay={(play) => {
            updateGameState(play);
          }}
          sound={!mute}
          disabled={
            // Disable the board if the opponent is online or ai and it's not their turn, or if there is no opponent
            (opponentType !== "local" && player !== gameState.turn.player) ||
            !opponent
          }
        />

        <div className="Controls">
          <PlayerCard
            player={player}
            local
            remove={gameState.turn.type === "remove"}
            turn={gameState.turn.player}
            name={name}
            onNameChange={(newName) => setPref("name", newName)}
            remainingMen={player ? gameState.remainingMen[player] : undefined}
            toolbarIcons={[
              {
                name: "settings",
                tooltip: "Settings and advanced",
                onClick: () => setIsAdvanced((prev) => !prev),
              },
            ]}
          >
            {isAdvanced && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <label
                  style={{ fontSize: "medium" }}
                >{`phase: ${gameState.phase}`}</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    id={"opponentControlled"}
                    type={"checkbox"}
                    checked={opponentType === "local"}
                    onChange={(e) =>
                      setOpponentType(e.target.checked ? "local" : "ai")
                    }
                  />
                  <label
                    style={{ fontSize: "medium" }}
                    htmlFor="opponentControlled"
                  >
                    control opponent
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    id={"mute"}
                    type={"checkbox"}
                    checked={mute}
                    onChange={(e) => setMute(e.target.checked)}
                  />
                  <label style={{ fontSize: "medium" }} htmlFor="mute">
                    mute
                  </label>
                  {/* TODO: Disable motion toggle */}
                </div>

                <Button onClick={() => updateGameState({ type: "reset" })}>
                  Reset
                </Button>
                {/* Temporarily adding a slider to control the number of rings */}
                {/* <Slider
              min={minRings}
              max={maxRings}
              value={ringCount}
              onChange={(e) => setRingCount(Number(e.target.value))}
              ringCount={ringCount}
            /> */}
              </div>
            )}
          </PlayerCard>
        </div>

        {/* Show raw Game State for debug */}
        {debug && <DebugGameState gameState={gameState} />}
      </div>
      {/* If there is a winner, show the modal, the game is over */}
      {gameState.winner && (
        <WinnerModal
          onPlayAgain={() => updateGameState({ type: "reset" })}
          winner={gameState.winner}
        />
      )}
    </div>
  );
};
