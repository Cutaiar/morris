import * as React from "react";
import styled from "styled-components";

// Components
import { Loader } from "components";

export type ButtonProps = React.PropsWithChildren<{
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  loading?: boolean;
}>;

export const Button = (props: ButtonProps) => {
  const { onClick, disabled, primary, loading, children } = props;

  return (
    <Root disabled={disabled} onClick={onClick} primary={primary}>
      <Content>
        {children}
        {loading && <Loader />}
      </Content>
    </Root>
  );
};

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8;
`;

const Root = styled.button<{ primary?: boolean }>`
  transition: transform 0.2s ease;
  transition: box-shadow 0.1s ease;
  cursor: pointer;

  min-width: 60px;
  min-height: 30px;
  background-color: ${({ primary, theme }) =>
    primary ? theme.palette.primary : theme.palette.surface};
  color: ${({ primary, theme }) =>
    primary ? theme.palette.surface : theme.palette.neutralDark};
  border-radius: 4px;
  border-style: solid;
  padding: 8px;
  border-width: 1px;
  border-color: currentColor;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: inherit;

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-elevation-medium);
  }

  &:disabled {
    border-color: ${({ theme }) => theme.palette.neutralLighter};
    color: ${({ theme }) => theme.palette.neutralLighter};
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
  }
`;
