import React from "react";

//Style
import { palette } from "theme";
import "./loader.css";

export interface LoaderProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "style" | "className"> {
  text?: string;
}

export const Loader = (props: LoaderProps) => {
  const { className, text } = props;
  const style: React.CSSProperties = {
    height: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
    ...props.style,
  };
  return (
    <div style={style} className={className}>
      <div className="loading" />
      {text && (
        <span style={{ color: palette.neutral, fontSize: "medium" }}>
          {text}
        </span>
      )}
    </div>
  );
};
