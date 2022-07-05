import React from "react";
import { IconType } from "react-icons";
import { FiCheck, FiEdit, FiSettings, FiX } from "react-icons/fi";

import "./iconButton.css";

type IconName = "edit" | "settings" | "check" | "x"; // TODO import feather directly to support all icons
export interface IconButtonProps {
  name: IconName;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

export const IconButton = (props: IconButtonProps) => {
  const { name, disabled, onClick, tooltip } = props;
  const icons: Record<IconName, IconType> = {
    edit: FiEdit,
    settings: FiSettings,
    check: FiCheck,
    x: FiX,
  };
  const disabledStyle: React.CSSProperties = {
    background: "rgb(74, 74, 74)",
    color: "gray",
  };
  const Icon = icons[name];
  return (
    <button
      className="icon-button-root"
      style={disabled ? disabledStyle : undefined}
      disabled={disabled}
      onClick={onClick}
      title={tooltip} // TODO: Don't use title for tooltip, use own component
    >
      <Icon />
    </button>
  );
};
