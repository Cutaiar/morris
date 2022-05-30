import { createStateContext } from "react-use";

// Intentionally not destructured to allow TSDoc on DebugProvider
const hookAndProvider = createStateContext(false);
const useDebugContext = hookAndProvider[0];

/**
 * Wrap components which wish to access debug status (via `useDebug`) in this provider.
 */
export const DebugProvider = hookAndProvider[1];

/**
 * `useDebug` to get the debug status of an app. Use like `useState` with an optional third array member
 * which is a function to sync the debug status with url param. (i.e. usedebug.com?debug)
 */
export const useDebug = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => void
] => {
  const [debug, setDebug] = useDebugContext();
  const syncDebugWithURL = () => {
    setDebug(window.location.search.includes("debug"));
  };
  return [debug, setDebug, syncDebugWithURL];
};
