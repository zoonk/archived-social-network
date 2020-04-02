import fetch from 'node-fetch';
import { UILanguage, WikipediaPage, WikipediaSearch } from '@zoonk/models';

export const getWikipediaPage = async (
  slug: string,
  language: UILanguage,
): Promise<WikipediaPage> => {
  const url = new URL(`https://${language}.wikipedia.org/w/api.php`);
  const params = url.searchParams;
  params.append('action', 'query');
  params.append('format', 'json');
  params.append('prop', 'info|pageimages|description');
  params.append('titles', slug);
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
    slug,
    title: slug.split('_').join(' '),
  };
};
