import React from "react";
import { palette } from "../../theme";
import "./button.css";
export interface ButtonProps
  extends React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
    primary?: boolean;
  }> {}

export const Button = (props: ButtonProps) => {
  const { onClick, disabled, primary } = props;

  // TODO: Better support for disabled
  const bgColor = disabled
    ? "grey"
    : primary
    ? palette.primary
    : palette.neutralLight;

  const textColor = primary ? palette.neutralLight : palette.neutralDark;

  return (
    <button
      disabled={disabled}
      className={"button-component"}
      style={{
        minWidth: 60,
        minHeight: 30,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: 5,
        borderStyle: "none",
      }}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
};
