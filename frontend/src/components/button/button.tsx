import React from "react";

import { palette } from "../../theme";
import "./button.css";

import { Loader } from "../../components";
export interface ButtonProps
  extends React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
    primary?: boolean;
    loading?: boolean;
  }> {}

export const Button = (props: ButtonProps) => {
  const { onClick, disabled, primary, loading } = props;

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
        padding: 8,
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {props.children}
        {loading && <Loader />}
      </div>
    </button>
  );
};
