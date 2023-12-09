import React from "react";
import styled, { keyframes } from "styled-components";

export interface LoaderProps {
  text?: string;
}

export const Loader = (props: LoaderProps) => {
  const { text } = props;

  return (
    <Root>
      <Spinner />
      {text && <Text>{text}</Text>}
    </Root>
  );
};

const Root = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const spin = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  &::after {
    content: "";
    width: 15px;
    height: 15px;
    border: 2px solid transparent;
    border-top-color: var(--morris-palette-neutral);
    border-radius: 50%;
    animation: ${spin} 1s ease infinite;
  }
`;

const Text = styled.span`
  color: ${({ theme }) => theme.palette.neutral};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;
