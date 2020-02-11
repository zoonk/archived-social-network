import { ContentMetadata } from './content';
import { Dictionary } from './misc';
import { SearchIndex } from './search';

/**
 * Posts model.
 */
export namespace Post {
  export interface Link {
    title: string;
    url: string;
  }

  export type Category = 'examples' | 'lessons' | 'posts' | 'questions';
  export type OrderBy = 'likes';

  export interface EditableFields {
    chapters: string[];
    content: string;
    links: string[] | null;
    order: Dictionary<number>;
    title: string;
  }

  export interface Fields extends EditableFields {
    category: Category;
  }

  /**
   * Required fields for creating an item.
   */
  export interface Create extends Fields, ContentMetadata.Create {}

  /**
   * Required fields for updating an item.
   */
  export interface Update
    extends Partial<EditableFields>,
      ContentMetadata.Update {
    topics?: string[];
  }

  /**
   * Fields returned from the backend.
   */
  export interface Response extends Fields, ContentMetadata.Response {}

  /**
   * Serialized fields.
   */
  export interface Get extends Fields, ContentMetadata.Get {
    id: string;
    sites: Link[];
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }

  /**
   * Search index fields.
   */
  export interface Index extends SearchIndex {
    category: Category;
    description: string;
    photo: string | null;
    title: string;
  }
}
