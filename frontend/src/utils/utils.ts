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
 * Use like Array.filter, but get a handle on the elements "filtered out"
 */
export const partition = (
  array: any[],
  predicate: (e: any) => boolean
): [any, any] => {
  return array.reduce(
    ([pass, fail], elem) => {
      return predicate(elem)
        ? [[...pass, elem], fail]
        : [pass, [...fail, elem]];
    },
    [[], []]
  );
};
