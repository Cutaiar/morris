import styled from "styled-components";

import { FallbackProps } from "react-error-boundary";

import { IconButton } from "components";

export const ErrorFallback = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;
  return (
    <Root>
      <b>An error occurred:</b>
      <pre>{error.message}</pre>
      <IconButton onClick={resetErrorBoundary} text="Refresh" />
    </Root>
  );
};

const Root = styled.div.attrs({ role: "alert" })`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: pink;
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;
