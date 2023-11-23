import React from "react";
import { createStateContext, useLocalStorage } from "react-use";

interface Prefs {
  mute?: boolean;
  reduceMotion?: boolean;
  name?: string;
}

/** The default preferences. These are used (and stored) when local storage is empty and for the PrefsProvider `initialValue` */
export const defaultPrefs = {
  mute: false,
  reduceMotion: false,
  name: "Me",
};

const LOCAL_STORAGE_KEY = "morris-prefs";

// Intentionally not destructured to allow TSDoc on DebugProvider
const hookAndProvider = createStateContext<Prefs>(defaultPrefs);
const usePrefsContext = hookAndProvider[0];

/**
 * Wrap components which wish to access user preferences status (via `usePrefs`) in this provider.
 */
export const PrefsProvider = hookAndProvider[1];

/**
 * `usePrefs` to get the players preferences. Use like `useState`. Immediately reflected in local storage.
 */
export const usePrefs = () => {
  const [prefs, setPrefs] = usePrefsContext();

  // Local storage prefs are the source of truth. They will default to `defaultPrefs` when `usePrefs` is called for the first time
  const [localStoragePrefs, setLocalStoragePrefs, clearLocalStorage] =
    useLocalStorage<Prefs>(LOCAL_STORAGE_KEY, defaultPrefs);

  // Sync stateContext `prefs` with `localStoragePrefs`
  React.useEffect(() => {
    if (localStoragePrefs) {
      setPrefs(localStoragePrefs);
    }
  }, [localStoragePrefs, setPrefs]);

  /** Set an individual preference value. Will be immediately reflected in local storage */
  const setPref = (pref: keyof Prefs, value: Prefs[typeof pref]) => {
    setLocalStoragePrefs({ ...prefs, [pref]: value });
  };

  /** Clear local storage and reset to default prefs */
  const reset = () => {
    clearLocalStorage();
    setLocalStoragePrefs(defaultPrefs);
  };

  return [prefs, setPref, reset] as const;
};
