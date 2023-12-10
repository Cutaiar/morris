import * as React from "react";
import styled, { useTheme } from "styled-components";

// Types
import { Player } from "hooks/useGameState";
import { getChipColor } from "utils";

export interface RemainingMenProps {
  remainingMenCount: number;
  player?: Player;
}

/**
 * Renders a remaining men UI. If player is undefined, disabled/loading state is shown
 */
export const RemainingMen: React.FC<RemainingMenProps> = (props) => {
  const { remainingMenCount, player } = props;

  const theme = useTheme();

  return (
    <Root>
      <Label>remaining men</Label>
      <Container>
        {new Array(remainingMenCount).fill(undefined).map((_, i) => (
          <Man key={i} color={getChipColor(theme, player)} />
        ))}
      </Container>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.palette.neutral};
  margin-bottom: 4px;
`;

const Man = styled.div<{ color: string }>`
  --diameter: 20px;
  width: var(--diameter);
  height: var(--diameter);
  border-radius: 50%;
  margin: calc(var(--diameter) / 4);
  background: ${(p) => p.color};
`;

const Container = styled.div`
  --diameter: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
  border-radius: 4px;
  border: ${({ theme }) => `1px solid ${theme.palette.neutral}`};
  padding: calc(var(--diameter) / 4);
  /* prettier-ignore */
  max-width: calc(10 * var(--diameter)); // 6 points to a row before wrapping plus magic extra.
  /* prettier-ignore */
  min-height: calc(3 * var(--diameter) / 2); // Maintain height after last man is gone
`;
