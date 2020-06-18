/**
 * JavaScript function to match (and return) the video Id
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: https://stackoverflow.com/a/10315969/624466
 */
export const containsYoutubeUrl = (text?: string | null): string | null => {
  if (!text) return null;
  const rule = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/g;
  const find = text.split(' ').find((str) => !!str.match(rule));
  return find ? RegExp.$1 : null;
};

/**
 * Check if a string contains a Vimeo URL.
 */
export const containsVimeoUrl = (text?: string | null): string | null => {
  if (!text) return null;
  const rule = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/i;
  const find = text.split(' ').find((str) => !!str.match(rule));
  return find ? RegExp.$1 : null;
};

/**
 * Get a domain name from a URL.
 */
export const getDomainFromUrl = (url: string): string => {
  try {
    const { host } = new URL(url);
    return host.replace('www.', '');
  } catch (e) {
    return 'unknown';
  }
};

/**
 * Check if an URL is internal or external.
 */
export const isInternal = (url: string): boolean => {
  return url.includes('zoonk.org') || url.startsWith('/');
};
