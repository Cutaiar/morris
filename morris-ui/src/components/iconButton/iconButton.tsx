import React from "react";
import styled from "styled-components";

// Icons
import { IconType } from "react-icons";
import {
  FiEye,
  FiCheck,
  FiEdit,
  FiSettings,
  FiUsers,
  FiWifi,
  FiX,
} from "react-icons/fi";


type IconName = "edit" | "settings" | "check" | "x" | "eye" | "users" | "wifi"; // TODO import feather directly to support all icons

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
  const icons: Record<IconName, IconType> = {
    edit: FiEdit,
    settings: FiSettings,
    check: FiCheck,
    x: FiX,
    eye: FiEye,
    users: FiUsers,
    wifi: FiWifi,
  };

  const Icon = name ? icons[name] : () => null;

  return (
    <Root
      disabled={disabled}
      onClick={onClick}
      title={tooltip} // TODO: Don't use title for tooltip, use own component
      hasText={!!text}
      fill={fill}
    >
    <Outer>
      <Inner hasText={!!text}>
        <Icon />
        {text && <ButtonText hasIcon={!!name}>{text}</ButtonText>}
      </Inner>
      {End?.()}
    </Outer>
    </Root>
  );
};

const ButtonText = styled.span<{hasIcon?: boolean}>`
  padding-left: ${({hasIcon}) => hasIcon && `8px`};
  margin: 0;
`;

const Inner = styled.div<{hasText?: boolean}>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({hasText}) => hasText ? "start" : "center"};
`;

const Outer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Root = styled.button<Pick<IconButtonProps, "fill"> & {hasText?: boolean}>`
  border-radius: 4px;
  background: transparent;
  min-width: ${({fill}) => fill ? `100%` : `30px`};
  min-height: 30px;
  padding: 0px;
  padding-inline: ${p => p.hasText && `8px`}; /* conditional style if the icon button has text */
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: none;
  color: currentColor;
  font-size: var(--morris-font-size-medium);
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
    border-color: ${({theme}) => theme.palette.neutralLighter};
    color: ${({theme}) => theme.palette.neutralLighter};
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
  }
`;
