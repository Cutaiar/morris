import { createGlobalStyle } from "styled-components";

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

export const GlobalStyle = createGlobalStyle`
  /* Generated from https://www.joshwcomeau.com/shadow-palette/ */
  :root {
    --shadow-color: 60deg 4% 60%;
    --shadow-elevation-low:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.34),
      0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34),
      1px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34);
    --shadow-elevation-medium:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
      0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
      2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
      5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
    --shadow-elevation-high:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.34),
      1.5px 2.9px 3.7px -0.4px hsl(var(--shadow-color) / 0.34),
      2.7px 5.4px 6.8px -0.7px hsl(var(--shadow-color) / 0.34),
      4.5px 8.9px 11.2px -1.1px hsl(var(--shadow-color) / 0.34),
      7.1px 14.3px 18px -1.4px hsl(var(--shadow-color) / 0.34),
      11.2px 22.3px 28.1px -1.8px hsl(var(--shadow-color) / 0.34),
      17px 33.9px 42.7px -2.1px hsl(var(--shadow-color) / 0.34),
      25px 50px 62.9px -2.5px hsl(var(--shadow-color) / 0.34);
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  * {
    box-sizing: border-box;
  }
`;

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
