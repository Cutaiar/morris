import React from "react";

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

// Style
import "./iconButton.css";

type IconName = "edit" | "settings" | "check" | "x" | "eye" | "users" | "wifi"; // TODO import feather directly to support all icons
export interface IconButtonProps {
  name: IconName;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  text?: string;
}

export const IconButton = (props: IconButtonProps) => {
  const { name, disabled, onClick, tooltip, text } = props;
  const icons: Record<IconName, IconType> = {
    edit: FiEdit,
    settings: FiSettings,
    check: FiCheck,
    x: FiX,
    eye: FiEye,
    users: FiUsers,
    wifi: FiWifi,
  };
  const disabledStyle: React.CSSProperties = {
    background: "rgb(74, 74, 74)",
    color: "gray",
  };

  const withTextStyle: React.CSSProperties = {
    paddingLeft: 8,
    paddingRight: 8,
  };

  const extraStyle = {
    ...(disabled ? disabledStyle : {}),
    ...(text ? withTextStyle : {}),
  };

  const Icon = icons[name];
  return (
    <button
      className="icon-button-root"
      style={extraStyle}
      disabled={disabled}
      onClick={onClick}
      title={tooltip} // TODO: Don't use title for tooltip, use own component
    >
      <Icon />
      {text && <p style={{ paddingLeft: 8, margin: 0 }}>{text}</p>}
    </button>
  );
};
