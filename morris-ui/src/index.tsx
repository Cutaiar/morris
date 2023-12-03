import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

import { ErrorBoundary } from "react-error-boundary";
import { App, ErrorFallback } from "components";
import { DebugProvider } from "hooks";
import { injectStyleVars } from "theme";

injectStyleVars();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // This makes App mount twice, can't have that rn...
  // <React.StrictMode>
  <DebugProvider>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <App />
    </ErrorBoundary>
  </DebugProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
