/**
 * Remove duplicated slashes from a string.
 * This is necessary because Next.js doesn't handle relative
 * URLs in a consistent manner.
 */
export const removeTrailingSlash = (asPath: string): string => {
  return asPath.replace(/\/+$/, '');
};
