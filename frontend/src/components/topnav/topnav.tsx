import React from "react";
import { fontSizes, fontWeights, palette } from "../../theme/theme";

const style = {
  root: {
    width: "calc(100% - 30px)",
    maxHeight: 200,
    padding: "15px",
    background: palette.neutralDark,
  },
  siteTitle: {
    fontSize: fontSizes.hero,
    fontWeight: fontWeights.bold,
    color: palette.neutralLight,
  },
};

export const TopNav = () => {
  return (
    <div style={style.root}>
      <span style={style.siteTitle}>Morris</span>
    </div>
  );
};
