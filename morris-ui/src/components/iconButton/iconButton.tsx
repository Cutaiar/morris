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
import { palette } from "theme";

type IconName = "edit" | "settings" | "check" | "x" | "eye" | "users" | "wifi"; // TODO import feather directly to support all icons
export interface IconButtonProps {
  name?: IconName;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  text?: string;
  style?: React.CSSProperties;
  End?: () => JSX.Element;
}

export const IconButton = (props: IconButtonProps) => {
  const { name, disabled, onClick, tooltip, text, style, End } = props;
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
    borderColor: palette.neutralLighter,
    color: palette.neutralLighter,
    transform: "none",
    boxShadow: "none",
    cursor: "not-allowed"
  };

  const withTextStyle: React.CSSProperties = {
    paddingLeft: 8,
    paddingRight: 8,
  };

  const extraStyle = {
    ...style,
    ...(disabled ? disabledStyle : {}),
    ...(text ? withTextStyle : {}),
  };

  const Icon = name ? icons[name] : () => null;
  return (
    <button
      className="icon-button-root"
      style={extraStyle}
      disabled={disabled}
      onClick={onClick}
      title={tooltip} // TODO: Don't use title for tooltip, use own component
    >
    <div style={{width: "100%", display:"flex", alignItems: "center", justifyContent: "space-between"}}>
      <div style={{width: "100%", display:"flex", alignItems: "center", justifyContent: props.text ? "start" : "center"}}>
        <Icon />
        {text && <p style={{ paddingLeft: name ? 8 : 0, margin: 0 }}>{text}</p>}
      </div>
      {End?.()}
    </div>
    </button>
  );
};
