import algolia from 'algoliasearch';
import { SearchResponse } from '@algolia/client-search';
import { Chapter, Post, SearchResult } from '@zoonk/models';
import { analytics, appLanguage, isProduction } from '@zoonk/utils';

const ALGOLIA_APP_ID = isProduction ? 'CEHDTPZ5VM' : 'J75DV0NKA3';
const ALGOLIA_SEARCH_KEY = isProduction
  ? '2c40ec50e48b4dce56529dcab5ee2b62'
  : '3d7f98ebda2a8a9276ce7755dd403556';

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
