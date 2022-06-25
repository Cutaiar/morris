import { createStateContext } from "react-use";

interface Prefs {
  mute?: boolean;
  motion?: boolean;
  name?: string;
}

export const defaultPrefs = {
  mute: false,
  motion: true,
  name: "Dillon",
};

// Intentionally not destructured to allow TSDoc on DebugProvider
const hookAndProvider = createStateContext(defaultPrefs); // TODO get prefs from cache?
const usePrefsContext = hookAndProvider[0];

/**
 * Wrap components which wish to access user preferences status (via `usePrefs`) in this provider.
 */
export const PrefsProvider = hookAndProvider[1];

/**
 * `usePrefs` to get the players preferences. Use like `useState` with an optional third array member
 * which is a function to sync the debug status with url param. (i.e. usedebug.com?debug)
 */
export const usePrefs = (): [
  Prefs,
  (pref: keyof Prefs, value: string | boolean | undefined) => void
] => {
  const [prefs, setPrefs] = usePrefsContext();

  const setPref = (pref: keyof Prefs, value: Prefs[typeof pref]) => {
    setPrefs({ ...prefs, [pref]: value });
  };

  return [prefs, setPref];
};
