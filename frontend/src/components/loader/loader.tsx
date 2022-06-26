import React from "react";

import "./loader.css";

export interface LoaderProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "style" | "className"> {}
export const Loader = (props: LoaderProps) => {
  const { className } = props;
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
