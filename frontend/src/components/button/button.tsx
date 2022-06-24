import React from "react";
import { palette } from "../../theme";
import "./button.css";
export interface ButtonProps
  extends React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
  }> {}

export const Button = (props: ButtonProps) => {
  const { onClick, disabled } = props;

  // TODO: Better support for disabled
  const bgColor = disabled ? "grey" : palette.primary;

  return (
    <button
      disabled={disabled}
      className={"button-component"}
      style={{
        minWidth: 60,
        minHeight: 30,
        backgroundColor: bgColor,
        color: palette.neutralLight,
        borderRadius: 5,
        borderStyle: "none",
      }}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
};
