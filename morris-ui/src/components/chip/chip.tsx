import styled from "styled-components";

interface ChipProps {
  /** The player this chip represents */
  color?: string;
  /** Is it `player`'s turn? */
  emphasis?: boolean;
}

/**
 * Represents a player
 *
 * TODO: State for player loading
 */
export const Chip = (props: ChipProps) => {
  return <Root {...props} />;
};

const Root = styled.div<ChipProps>`
  min-width: 20px;
  min-height: 20px;
  border-radius: 50%;
  background: ${({ color }) => color};
  border: ${({ emphasis, theme }) =>
    emphasis && `1px solid ${theme.palette.neutral}`};
`;
