import React from "react";
import styled from "styled-components";

export const TopNav = () => {
  return (
    <Root>
      <Title>morris</Title>
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
  height: 10vh;
  padding: 25px;
  background: ${({ theme }) => theme.palette.background};
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.palette.neutral};
`;
