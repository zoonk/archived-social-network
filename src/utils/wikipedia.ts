/**
 * Get the slug/id from a Wikipedia page title.
 */
export const getWikipediaSlug = (name: string): string => {
  return name.split(' ').join('_');
};
