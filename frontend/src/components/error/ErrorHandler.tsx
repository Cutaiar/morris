import { FallbackProps } from "react-error-boundary";

import { Button } from "../../components";

export const ErrorFallback = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backgroundColor: "pink",
      }}
    >
      <b>An error occurred:</b>
      <pre>{error.message}</pre>
      <Button primary onClick={resetErrorBoundary}>
        Refresh
      </Button>
    </div>
  );
};
