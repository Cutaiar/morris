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
    tiny: "0.5rem", // 8px
    small: "0.75rem", // 12px
    medium: "1rem", // 16px
    large: "1.25rem", // 20px
    xlarge: "2rem", // 32px
    hero: "3rem", // 48 px
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

/**
 * Add CSS vars for the global styles so that components using css file styles can access them
 */
export const injectStyleVars = () => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync('');
  document.adoptedStyleSheets = [sheet];
  const buildDeclarations = (obj: Record<string, string>, prefix: string) => Object.entries(obj).map(e => `    ${prefix}${e[0]}: ${e[1]};`).join("\n");

  const paletteDeclarations = buildDeclarations(defaultTheme.palette, "--morris-palette-")
  const fontSizeDeclarations = buildDeclarations(defaultTheme.fontSizes, "--morris-font-size-")
  const rule = `:root {\n${paletteDeclarations}${fontSizeDeclarations}\n}`
  sheet.insertRule(rule, sheet.cssRules.length);
}
