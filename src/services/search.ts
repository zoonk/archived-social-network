import algolia from 'algoliasearch';
import { SearchResponse } from '@algolia/client-search';
import { Chapter, Post, SearchResult } from '@zoonk/models';
import { analytics, appLanguage } from '@zoonk/utils';

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID as string;
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY as string;

const client = algolia(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

/**
 * Full-text search across all collections.
 */
export const search = async (
  query: string,
): Promise<SearchResponse<SearchResult>[]> => {
  const indexes = ['topics', 'posts'];
  const queries = indexes.map((item) => ({
    indexName: `${item}_${appLanguage}`,
    query,
    params: { hitsPerPage: 5 },
  }));
  analytics().logEvent('search', { search_term: query });
  const res = await client.multipleQueries<SearchResult>(queries);
  return res.results.map((item) => ({
    ...item,
    // Remove the language suffix from the index name.
    index: item.index?.slice(0, item.index.length - 3),
  }));
};

/**
 * Search for an existing chapter.
 */
export const searchChapter = async (
  query: string,
): Promise<ReadonlyArray<Chapter.Index>> => {
  const index = client.initIndex(`chapters_${appLanguage}`);
  const req = await index.search<Chapter.Index>(query, { hitsPerPage: 5 });
  return req.hits;
};

/**
 * Search for an existing post.
 */
export const searchPost = async (
  query: string,
  category?: Post.Category,
): Promise<ReadonlyArray<Post.Index>> => {
  const index = client.initIndex(`posts_${appLanguage}`);
  const req = await index.search<Post.Index>(query, {
    hitsPerPage: 5,
    filters: category ? `category:${category}` : undefined,
  });
  return req.hits;
};
