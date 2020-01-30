import { ContentMetadata } from './content';
import { SearchIndex } from './search';

/**
 * Chapters model.
 */
export namespace Chapter {
  export interface EditableFields {
    description: string;
    order: number;
    photo: string | null;
    title: string;
  }

  interface Fields extends EditableFields {
    examples: number;
    lessons: number;
    pathId: string;
    posts: number;
  }

  /**
   * Required fields for creating a chapter.
   */
  export interface Create extends Fields, ContentMetadata.Create {}

  /**
   * Required fields for updating a chapter.
   */
  export interface Update
    extends Partial<EditableFields>,
      ContentMetadata.Update {}

  /**
   * Fields returned from the backend.
   */
  export interface Response extends Fields, ContentMetadata.Response {}

  /**
   * Serialized fields.
   */
  export interface Get extends Fields, ContentMetadata.Get {
    id: string;
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
    description: string;
    pathId: string;
    photo: string | null;
    title: string;
  }
}
