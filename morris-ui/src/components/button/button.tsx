import React from "react";

// Style
import { palette } from "theme";
import "./button.css";

// Components
import { Loader } from "components";
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
  const bgColor = primary
    ? palette.primary
    : palette.surface;

  const textColor = primary ? palette.neutralLight : palette.neutralDark;

  const disabledStyle: React.CSSProperties = {
    borderColor: palette.neutralLighter,
    color: palette.neutralLighter,
    transform: "none",
    boxShadow: "none",
    cursor: "not-allowed"
  };

  const extraStyle = {
    ...(disabled ? disabledStyle : {}),
  };

  return (
    <button
      disabled={disabled}
      className={"button-component"}
      style={{
        minWidth: 60,
        minHeight: 30,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: 4,
        borderStyle: "solid",
        padding: 8,
        borderWidth: 1,
        borderColor: textColor,
        ...extraStyle
      }}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {props.children}
        {loading && <Loader />}
      </div>
    </button>
  );
};
