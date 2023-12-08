import React from "react";
import styled, { keyframes } from "styled-components";

// Types
import { Player } from "hooks/useGameState";

// Hooks
import { useWindowSize } from "react-use";

// Components
import Confetti from "react-confetti";
import { Button } from "components";

import { confetti} from "theme";

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
    <Root>
      <Confetti
        width={width}
        height={height}
        colors={winner === "a" ? confetti.primary : confetti.secondary}
      />
      <Surface winner={winner}>
        <Title>{`${winnerName} wins.`}</Title>
        <Button onClick={onPlayAgain}>Play again</Button>
      </Surface>
    </Root>
  );
};

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: hsl(0deg 0% 10% / .3);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const fadeInOpacity = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Title = styled.h1`
  font-size: ${({theme}) => theme.fontSizes.xlarge};
`;

const Surface = styled.div<Pick<WinnerModalProps, "winner">>`
  opacity: 1;
  animation-name: ${fadeInOpacity};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.5s;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 800px;
  height: 200px;
  border-radius: 10px;
  background-color: ${({winner, theme}) => winner === "a" ? theme.palette.primary : theme.palette.secondary};
`;
