import styled from "styled-components";

import * as Icon from "react-feather";

type IconName = keyof typeof Icon;

export interface IconButtonProps {
  name?: IconName;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  text?: string;
  fill?: boolean;
  End?: () => JSX.Element;
}

export const IconButton = (props: IconButtonProps) => {
  const { name, disabled, onClick, tooltip, text, fill, End } = props;

  const I = name && Icon[name] ? Icon[name] : () => null;

  return (
    <Root
      disabled={disabled}
      onClick={onClick}
      title={tooltip} // TODO: Don't use title for tooltip, use own component
      hasText={!!text}
      $fill={fill}
    >
      <Outer>
        <Inner hasText={!!text}>
          <I size={16} />
          {text && <ButtonText hasIcon={!!name}>{text}</ButtonText>}
        </Inner>
        {End?.()}
      </Outer>
    </Root>
  );
};

const ButtonText = styled.span<{ hasIcon?: boolean }>`
  padding-left: ${({ hasIcon }) => hasIcon && `8px`};
  margin: 0;
`;

const Inner = styled.div<{ hasText?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ hasText }) => (hasText ? "start" : "center")};
`;

const Outer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Root = styled.button<{ $fill?: boolean; hasText?: boolean }>`
  border-radius: 4px;
  background: transparent;
  min-width: ${({ $fill }) => ($fill ? `100%` : `30px`)};
  max-width: ${({ $fill }) => !$fill && "fit-content"};
  min-height: 30px;
  padding: 0px;
  padding-inline: ${(p) =>
    p.hasText && `8px`}; /* conditional style if the icon button has text */
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: none;
  color: currentColor;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: inherit;
  box-sizing: border-box;
  transition: transform 0.2s ease;
  transition: box-shadow 0.2s ease;
  border: 1px solid #161616;

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-elevation-medium);
  }

  &:active {
    transform: scale(0.9);
    box-shadow: none;
  }

  &:disabled {
    border-color: ${({ theme }) => theme.palette.neutralLighter};
    color: ${({ theme }) => theme.palette.neutralLighter};
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
  }
`;
