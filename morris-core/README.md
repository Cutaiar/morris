# morris-core

`morris-core` is a typescript implementation of the ancient game called morris. It is implemented as a reducer originally written for use with `React.useReducer`, but can of course be used outside react. It is simply a single function which takes two parameters (state and action) and returns the state resulting from execution the given action on the given state. Keep track of this state over time, allow the user to execute actions on it, and viola -- you have a game.

`morris-core` currently only supports 6 man morris, but is written with expansion in mind. At least 9 and 12 man morris will be supported. Hopefully larger games, recursive, and 3 dimensional games will be supported too.

Its TS source is imported directly without transpiling.

## Usage with React

```ts
// Tentative
import { reducer, initialState } from "morris-core";

export const useMorrisCoreReducer = () => {
  // Turn the reducer function and initialState into a react reducer
  return React.useReducer(reducer, initialState);
};
```

## Usage in pure js

```ts
// Tentative
import { useGameStateOutsideReact } from "morris-core";

// Make sure to only call this once
const [state, updateState] = useGameStateOutsideReact();
```
