import React from "react";

// Style
import "./App.css";
import { palette } from "../../theme";

// State
import { Player, useGameState } from "../../hooks/useGameState";

// Components
import { Board } from "../board";
import { Opponent } from "../opponent/opponent";
import { TopNav } from "../topnav/topnav";
import { DebugGameState } from "../debug/debugGameState";
import { WinnerModal } from "../winnerModal.tsx/winnerModal";
import { PlayerCard } from "../playerCard/playerCard";
import GithubCorner from "react-github-corner";

// Hooks
import { useDebug } from "../../hooks/useDebug";
import { useMount } from "react-use";
import { useSocketGameState } from "../../hooks/useSocketGameState";

// TODO: Move to utils or something
const openInNewTab = { target: "_blank", rel: "noopener noreferrer" };

export const App: React.FC = () => {
  // TODO: Don't use online state all the time, just when online mode is true
  // const [gameState, updateGameState] = useGameState();
  const [gameState, updateGameState, player] = useSocketGameState();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debug, _, syncDebug] = useDebug();
  useMount(() => syncDebug());

  // Whether the game is muted or not
  const [mute, setMute] = React.useState(false);

  // If advanced controls are open or not
  const [isAdvanced, setIsAdvanced] = React.useState(false);

  // Whether the opponent is controlled by the keyboard or not
  const [opponentControlled, setOpponentControlled] = React.useState(false);

  return (
    <>
      <div className="App">
        <TopNav />
        <div className="Page">
          <div className="Controls">
            {/* TODO: These controls will be for the OOTB Opponent experience */}
            {/* <button>Play AI</button>
            <button>Play local</button>
            <button>Play online</button> */}
            <PlayerCard
              player={player === "a" ? "b" : "a"}
              remove={gameState.turn.type === "remove"}
              turn={gameState.turn.player}
              name="Opponent"
              remainingMen={player ? gameState.remainingMen[player] : 0}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                id={"opponentControlled"}
                type={"checkbox"}
                checked={opponentControlled}
                onChange={(e) => setOpponentControlled(e.target.checked)}
              />
              <label
                style={{ fontSize: "medium" }}
                htmlFor="opponentControlled"
              >
                control opponent
              </label>
            </div>
            {!opponentControlled ? (
              <Opponent
                state={gameState}
                player={"b"}
                updateGameState={updateGameState}
                sound={!mute}
              />
            ) : (
              <label style={{ fontSize: "medium" }}>
                opponent is controlled
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
            player={player}
          />

          <div className="Controls">
            <PlayerCard
              player={player}
              remove={gameState.turn.type === "remove"}
              turn={gameState.turn.player}
              name={"Me"}
              remainingMen={player ? gameState.remainingMen[player] : 0}
            />

            <span
              style={{ fontSize: "medium", textDecoration: "underline" }}
              onClick={() => setIsAdvanced((prev) => !prev)}
            >
              Advanced
            </span>
            {isAdvanced && (
              <div>
                <label
                  style={{ fontSize: "medium" }}
                >{`phase: ${gameState.phase}`}</label>
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

                <button
                  style={{
                    minWidth: 60,
                    minHeight: 30,
                    backgroundColor: palette.primary,
                    color: palette.neutralLight,
                    borderRadius: 5,
                    borderStyle: "none",
                  }}
                  onClick={() => updateGameState({ type: "reset" })}
                >
                  Reset
                </button>
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
          </div>

          {/* Show raw Game State for debug */}
          {debug && <DebugGameState gameState={gameState} />}
        </div>
      </div>
      {gameState.winner && (
        <WinnerModal
          onPlayAgain={() => updateGameState({ type: "reset" })}
          winner={gameState.winner}
        />
      )}
      <GithubCorner
        href="https://github.com/Cutaiar/morris"
        bannerColor={palette.neutral}
        octoColor={palette.background}
        size={80}
        direction="right"
        {...openInNewTab}
      />
    </>
  );
};

export default App;
