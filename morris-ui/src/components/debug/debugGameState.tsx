import React from "react";
import styled from "styled-components";

import { GameState } from "hooks/useGameState";

export interface DebugGameStateProps {
  gameState: GameState;
}
export const DebugGameState = (props: DebugGameStateProps) => {
  const { gameState } = props;
  return (
    <Root>
      <label>Game State</label>
      <GameStateObject>
        {JSON.stringify(gameState, null, 2)}
      </GameStateObject>
    </Root>
  );
};

// Consider using Prism to syntax highlight this code
// https://blog.logrocket.com/guide-syntax-highlighting-react/
const GameStateObject = styled.code`
  font-size: var(--morris-font-size-small);
  white-space: pre-wrap;
`;

const Root = styled.div`
  height: 80vh;
  overflow: auto;
  position: absolute;
  top: 100px;
  left: 20px;
`;
