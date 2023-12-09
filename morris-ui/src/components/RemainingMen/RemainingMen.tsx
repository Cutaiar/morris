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

  const diameter = 20;
  const theme = useTheme();

  return (
    <Root diameter={diameter}>
      <Label>remaining men</Label>
      <Container diameter={diameter}>
        {new Array(remainingMenCount).fill(undefined).map((_, i) => (
          <Man
            key={i}
            diameter={diameter}
            color={getChipColor(theme, player)}
          />
        ))}
      </Container>
    </Root>
  );
};

type UsesDiameter = { diameter: number };

const Root = styled.div<UsesDiameter>`
  display: flex;
  flex-direction: column;
  gap: calc(${(p) => p.diameter + "px"} / 4);
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.palette.neutral};
`;

const Container = styled.div<UsesDiameter>`
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
  border-radius: 5px;
  border: ${({ theme }) => `1px solid ${theme.palette.neutral}`};
  padding: calc(${(p) => p.diameter + "px"} / 4);
  /* TODO: Cleaner calculations, and width should probably just be 100% */
  min-height: calc(
    ${(p) => (3 * p.diameter) / 2 + "px"}
  ); // Maintain height after last man is gone
  max-width: calc(
    ${(p) => ((3 * p.diameter) / 2) * 6 + (3 * p.diameter) / 4 + "px"}
  ); // 6 points to a row before wrapping plus magic extra.
`;

const Man = styled.div<UsesDiameter & { color: string }>`
  width: ${(p) => p.diameter + "px"};
  height: ${(p) => p.diameter + "px"};
  border-radius: 50%;
  margin: calc(${(p) => p.diameter + "px"} / 4);
  background: ${(p) => p.color};
`;
