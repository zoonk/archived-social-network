import { Post } from './post';
import { Topic } from './topic';

/**
 * Required properties for creating a search index.
 */
export interface SearchIndex {
  itemPath: string;
  objectID: string;
}

export type SearchResult = Post.Index | Topic.Index;
