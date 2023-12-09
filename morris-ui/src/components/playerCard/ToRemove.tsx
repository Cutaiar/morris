import * as React from "react";
import styled from "styled-components";

/**
 * A tag to be shown in indication that the current turn is a removal
 */
export const ToRemove = () => {
  return <Root>to remove</Root>;
};

const Root = styled.div`
  background: ${({ theme }) => theme.palette.surface};
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.palette.neutral};
  border-color: ${({ theme }) => theme.palette.neutral};
  border-style: solid;
  border-width: 1px;
`;
