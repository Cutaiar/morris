/**
 * Pick a random property of `obj`
 */
export function getRandomProperty(obj: {}) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}
