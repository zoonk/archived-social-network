/**
 * Convert `undefined` or `null` to a number.
 */
export const toNumber = (value?: number | null): number => {
  return !value ? 0 : Number(value);
};
