import algolia from 'algoliasearch';
import { SearchResponse } from '@algolia/client-search';
import { Chapter, Post, SearchResult } from '@zoonk/models';
import { appLanguage } from '@zoonk/utils';

const NEXT_PUBLIC_ALGOLIA_APP_ID = process.env
  .NEXT_PUBLIC_ALGOLIA_APP_ID as string;
const NEXT_PUBLIC_ALGOLIA_SEARCH_KEY = process.env
  .NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string;

const client = algolia(
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
);

export const search = async (
  query: string,
): Promise<SearchResponse<SearchResult>[]> => {
  const indexes = ['topics', 'posts'];
  const queries = indexes.map((item) => ({
    indexName: `${item}_${appLanguage}`,
    query,
    params: { hitsPerPage: 5 },
  }));
  const res = await client.multipleQueries<SearchResult>(queries);
  return res.results.map((item) => ({
    ...item,
    // Remove the language suffix from the index name.
    index: item.index?.slice(0, item.index.length - 3),
  }));
};

export const searchChapter = async (
  query: string,
): Promise<ReadonlyArray<Chapter.Index>> => {
  const index = client.initIndex(`chapters_${appLanguage}`);
  const req = await index.search<Chapter.Index>(query, { hitsPerPage: 5 });
  return req.hits;
};

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
