/**
 * Represents the theme of the app. Untyped as the shape of this object is used to drive the styled-components DefaultTheme type in `styled.d.ts`
 */
export const defaultTheme = {
  palette: {
    background: "#f4f4f1",
    surface: "#f7f7f6",
    neutral: "#161616",
    neutralLight: "#434343",
    neutralLighter: "#707070",
    neutralDark: "#121212",
    primary: "#D2042D",
    secondary: "#1E90FF",
  },
  fontSizes: {
    tiny: "10px",
    small: "12px",
    medium: "14px",
    large: "18px",
    hero: "48px",
  },
  fontWeights: {
    thin: 200,
    regular: 400,
    semibold: 600,
    bold: 800,
  },
} as const;

// For back compat rn...
export const palette = defaultTheme.palette;
export const fontSizes = defaultTheme.fontSizes;
export const fontWeights = defaultTheme.fontWeights;

// TODO, make this a build function inside a new component
export const confetti = {
  primary: [
    palette.primary,
    "#bd0429",
    "#a80324",
    "#93031f",
    "#7e021b",
    "#690217",
    "#d71d42",
    "e98296",
  ],
  secondary: [
    palette.secondary,
    "#1b82e6",
    "#1873cc",
    "#1565b3",
    "#125699",
    "#8fc8ff",
    "#d2e9ff",
  ],
};

export const injectStyleVars = () => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync('');
  document.adoptedStyleSheets = [sheet];

  let index = sheet.cssRules.length;

  const declarations =  Object.entries(defaultTheme.palette).map(e => `    --morris-palette-${e[0]}: ${e[1]};`).join("\n");
  const rule = `:root {\n${declarations}\n}`
  sheet.insertRule(rule, index);
}
