module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./*/tsconfig.json"]
  },
  plugins: ["@typescript-eslint", "react"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {}
};
