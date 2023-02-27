import { createStateContext } from "react-use";

// Intentionally not destructured to allow TSDoc on DebugProvider
const hookAndProvider = createStateContext(false);
const useDebugContext = hookAndProvider[0];

/**
 * Wrap components which wish to access debug status (via `useDebug`) in this provider.
 */
export const DebugProvider = hookAndProvider[1];

const debugSearchParam = "debug";

/**
 * `useDebug` to get the debug status of an app. Use like `useState` with an optional third array member
 * which is a function to sync the debug status with url param. (i.e. usedebug.com?debug)
 *
 * Note that the setter includes an optional boolean `shouldSyncURL`.
 * When true, the url will be synced with whatever `debug` was just set to. This will cause a page reload.
 */
export const useDebug = (): [
  boolean,
  (value: boolean, shouldSyncURL?: boolean) => void,
  () => void
] => {
  const [debug, setDebug] = useDebugContext();
  const syncDebugWithURL = () => {
    setDebug(window.location.search.includes(debugSearchParam));
  };
  const setDebugAndPotentiallySyncURL = (
    value: boolean,
    shouldSyncURL?: boolean
  ) => {
    setDebug(value);

    // Sync url with what we just set debug to
    if (shouldSyncURL) {
      const url = new URL(window.location.href);
      const hasDebugParam = url.searchParams.has(debugSearchParam);
      if (value) {
        if (!hasDebugParam) {
          url.searchParams.append(debugSearchParam, "");
        }
      } else {
        if (hasDebugParam) {
          url.searchParams.delete(debugSearchParam);
        }
      }
      window.location.href = url.href; // TODO: is this safe?
    }
  };
  return [debug, setDebugAndPotentiallySyncURL, syncDebugWithURL];
};
