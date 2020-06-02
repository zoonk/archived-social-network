/**
 * Typescript doesn't do a proper type inference for `Object.entries`.
 * This function tries to fix this issue.
 * Ref: https://github.com/microsoft/TypeScript/issues/21826
 */
export const entries = Object.entries as <T>(
  o: T,
) => [Extract<keyof T, string>, T[keyof T]][];
