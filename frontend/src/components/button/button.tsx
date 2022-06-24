import React from "react";
import { palette } from "../../theme";

export interface ButtonProps
  extends React.PropsWithChildren<{ onClick: () => void }> {}

export const Button = (props: ButtonProps) => {
  const { onClick } = props;

  return (
    <button
      style={{
        minWidth: 60,
        minHeight: 30,
        backgroundColor: palette.primary,
        color: palette.neutralLight,
        borderRadius: 5,
        borderStyle: "none",
      }}
      onClick={onClick}
    >
      Reset
    </button>
  );
};
