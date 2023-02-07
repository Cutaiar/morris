import React from "react";

// Types
import { Player } from "hooks/useGameState";

// Hooks
import { useWindowSize } from "react-use";

// Style
import "./winnerModal.css";
import { confetti, palette } from "theme";

// Components
import Confetti from "react-confetti";
import { Button } from "components";

export interface WinnerModalProps {
  /** cb for when the "play again" button is selected */
  onPlayAgain: () => void;
  /** which player won? */
  winner: Player;
  /** Name of the winning player */
  winnerName: string;
}

/**
 * Shown when a player wins the game
 */
export const WinnerModal = (props: WinnerModalProps) => {
  const { onPlayAgain, winner, winnerName } = props;

  const { width, height } = useWindowSize();

  return (
    <>
      <Confetti
        width={width}
        height={height}
        colors={winner === "a" ? confetti.primary : confetti.secondary}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "transparent",
          zIndex: 100000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: 800,
            height: 200,
            borderRadius: 10,
            backgroundColor:
              winner === "a" ? palette.primary : palette.secondary,
          }}
          className="fade-in"
        >
          <h1>{`${winnerName} wins.`}</h1>
          <Button onClick={onPlayAgain}>Play again</Button>
        </div>
      </div>
    </>
  );
};
