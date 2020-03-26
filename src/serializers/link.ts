import { Post } from '@zoonk/models';
import { getDomainFromUrl } from '@zoonk/utils';

/**
 * Serialize a link to return the website's name and URL.
 */
export const serializeLink = (url: string): Post.Link => {
  return {
    description: null,
    image: null,
    title: getDomainFromUrl(url),
    url,
  };
};

/**
 * Serialize a collection of links to get a website's name and URL.
 */
export const serializeLinkCollection = (
  links?: string[] | null,
): Post.Link[] => {
  if (!links) return [];
  return links.filter(Boolean).map(serializeLink);
};
