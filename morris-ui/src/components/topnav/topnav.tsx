import React from "react";

// Style
import { fontSizes, fontWeights, palette } from "theme";

const style: Record<string, React.CSSProperties> = {
  root: {
    width: "calc(100% - 50px)",
    height: "10vh",
    padding: "25px",
    background: palette.background,
    display: "flex",
    alignItems: "center"
  },
  siteTitle: {
    fontSize: fontSizes.hero,
    fontWeight: fontWeights.bold,
    color: palette.neutral
  },
};

export const TopNav = () => {
  return (
    <div style={style.root}>
      <span style={style.siteTitle}>morris</span>
    </div>
  );
};
