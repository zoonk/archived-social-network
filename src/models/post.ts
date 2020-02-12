import { ContentMetadata, ContentSummary } from './content';
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
    content: string;
    links: string[] | null;
    order: number | null;
    title: string;
  }

  export interface Fields extends EditableFields {
    category: Category;
    chapterId: string | null;
  }

  interface Metadata {
    chapter?: ContentSummary;
    path?: ContentSummary;
    pathId?: string | null;
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
  export interface Response
    extends Fields,
      Metadata,
      ContentMetadata.Response {}

  /**
   * Serialized fields.
   */
  export interface Get extends Fields, Metadata, ContentMetadata.Get {
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
