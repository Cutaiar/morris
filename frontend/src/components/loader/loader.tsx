import React from "react";

import { palette } from "../../theme";

import "./loader.css";

export interface LoaderProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "style" | "className"> {
  color?: string;
}
export const Loader = (props: LoaderProps) => {
  const { className, color } = props;
  const style = {
    width: 30,
    height: 30,
    ...props.style,
  };
  return (
    <div style={style} className={className}>
      <div className="loading" />
    </div>
  );
};
