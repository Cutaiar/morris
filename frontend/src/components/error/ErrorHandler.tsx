import { FallbackProps } from "react-error-boundary";
import { palette } from "../../theme";

export const ErrorFallback: React.FC<FallbackProps> = (props) => {
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
      <button
        style={{
          minWidth: 60,
          minHeight: 30,
          backgroundColor: palette.primary,
          color: palette.neutralLight,
          borderRadius: 5,
          borderStyle: "none",
        }}
        onClick={resetErrorBoundary}
      >
        Refresh
      </button>
    </div>
  );
};
