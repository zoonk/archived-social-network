import {
  UILanguage,
  WikipediaPage,
  WikipediaPrefixSearch,
  WikipediaSearch,
  WikipediaSearchItem,
} from '@zoonk/models';
import { getWikipediaSlug } from '@zoonk/utils';

/**
 * Get data from a Wikipedia page.
 * @param page - page name.
 * @param language - language to query.
 */
export const getWikipediaPage = async (
  page: string,
  language: UILanguage,
): Promise<WikipediaPage> => {
  const url = new URL(`https://${language}.wikipedia.org/w/api.php`);
  const params = url.searchParams;
  params.append('action', 'query');
  params.append('format', 'json');
  params.append('prop', 'info|pageimages|description');
  params.append('titles', page);
  params.append('inprop', 'displaytitle|url');
  params.append('piprop', 'thumbnail');
  params.append('pithumbsize', '400');
  params.append('redirects', '1');
  params.append('formatversion', '2');
  params.append('origin', '*');

  const res = await fetch(url.href);
  const json = (await res.json()) as WikipediaSearch;

  return {
    description: json.query.pages[0].description || '',
    photo: json.query.pages[0].thumbnail?.source || null,
    slug: getWikipediaSlug(page),
    title: page,
  };
};

/**
 * Search a topic on Wikipedia.
 */
export const searchTopic = async (
  query: string,
  language: UILanguage,
  limit: string = '20',
): Promise<WikipediaSearchItem[]> => {
  const url = new URL(`https://${language}.wikipedia.org/w/api.php`);
  const params = url.searchParams;
  params.append('action', 'query');
  params.append('pssearch', query);
  params.append('pslimit', limit);
  params.append('format', 'json');
  params.append('list', 'prefixsearch');
  params.append('redirects', '1');
  params.append('formatversion', '2');
  params.append('origin', '*');

  const res = await fetch(url.href);
  const json = (await res.json()) as WikipediaPrefixSearch;

  if (!json || !json.query) {
    return [];
  }

  return json.query.prefixsearch.map((item) => {
    return {
      ...item,
      slug: getWikipediaSlug(item.title),
    };
  });
};
