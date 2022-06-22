import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { App } from "./components/app";
import { ErrorFallback } from "./components/error";
import { ErrorBoundary } from "react-error-boundary";
import { DebugProvider } from "./hooks/useDebug";
import { SocketProvider } from "./context";

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
      {/* Maybe we don't want to have a socket provider here, we only want to if this is multiplayer */}
      <SocketProvider>
        <App />
      </SocketProvider>
    </ErrorBoundary>
  </DebugProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
