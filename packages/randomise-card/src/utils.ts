/**
 * Generates a random integer between min and max inclusive
 * @param min Start of the range
 * @param max End of the range
 * @returns Random integer
 */
export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Selects a random element from the array
 * @param arr The array to select the element from
 * @returns The random element
 */
export const randomElement = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Returns either true or false at random
 */
export const randomBool = () => Math.random() < 0.5;

export const capitalizeFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);
