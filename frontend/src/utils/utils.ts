// File contains utils used in the frontend morris web app

/**
 * Destructure into props to make a link safely open in a new tab
 */
export const openInNewTabProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};

/**
 * Pick a random property of `obj`
 */
export function getRandomProperty(obj: {}) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Get a random element from an array
 */
export const getRandomElement = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
