/**
 * Convert a topic id into a page title.
 */
export const getPageTitle = (title: string): string => {
  const removeLanguage = title.slice(0, title.length - 3);
  return removeLanguage.split('_').join(' ');
};

/**
 * Generate a random string ID.
 */
export const getRandomId = (): string => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};

/**
 * Generate a friendly slug from a string.
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

/**
 * Generate a friendly slug from a string but contaning a radom ID.
 */
export const generateRandomSlug = (title: string): string => {
  const slug = generateSlug(title);
  const id = `${slug}-${getRandomId()}`;
  return id;
};
