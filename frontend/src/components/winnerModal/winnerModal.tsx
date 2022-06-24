import React from "react";
import { Player } from "../../hooks/useGameState";
import { confetti, palette } from "../../theme/theme";
import Confetti from "react-confetti";

import "./winnerModal.css";
import { useWindowSize } from "react-use";

export interface WinnerModalProps {
  onPlayAgain: () => void;
  winner: Player;
}
export const WinnerModal = (props: WinnerModalProps) => {
  const { onPlayAgain, winner } = props;

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
          <h1>{`${winner} wins.`}</h1>
          <button
            style={{
              minWidth: 60,
              minHeight: 30,
              backgroundColor: palette.neutralLight,
              color: palette.neutralDark,
              borderRadius: 5,
              borderStyle: "none",
            }}
            onClick={onPlayAgain}
          >
            Play again
          </button>
        </div>
      </div>
    </>
  );
};
