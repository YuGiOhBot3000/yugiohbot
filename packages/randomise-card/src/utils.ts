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

/**
 * Rounds a number up to the nearest value
 * @param n Number to round up
 * @param to Division to round up to. E.g. 100 for the nearest 100
 * @returns Rounded number. E.g. `roundUp(245, 100) === 300`
 */
export const roundUp = (n: number, to: number) => Math.ceil(n / to) * to;

export const capitalizeFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);
