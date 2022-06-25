import React from "react";

import { Player } from "../../hooks/useGameState";
import { useWindowSize } from "react-use";

import "./winnerModal.css";
import { confetti, palette } from "../../theme/theme";

import Confetti from "react-confetti";
import { Button } from "../../components";

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
          <h1>{`${winner} wins.`}</h1>
          <Button onClick={onPlayAgain}>Play again</Button>
        </div>
      </div>
    </>
  );
};
