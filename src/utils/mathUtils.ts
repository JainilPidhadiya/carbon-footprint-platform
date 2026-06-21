/**
 * @file utils/mathUtils.ts
 * @description General-purpose mathematical helpers for the EcoTrack platform.
 */

/**
 * Rounds a floating-point number to a specified number of decimal places.
 * 
 * @param val The numeric value to round.
 * @param decimals The target decimal precision (defaults to 2).
 * @returns The rounded number.
 */
export const roundTo = (val: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
};
