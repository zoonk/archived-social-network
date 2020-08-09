import { Chapter } from './chapter';
import { ContentMetadata } from './content';
import { SearchIndex } from './search';

/**
 * Topic model.
 */
export namespace Topic {
  interface EditableFields {
    description: string;
    photo: string | null;
  }

  interface Fields extends EditableFields {
    chapters: string[];
    followers: number;
    posts: number;
    title: string;
  }

  /**
   * Required fields for creating a topic.
   */
  export interface Create extends Fields, ContentMetadata.Create {}

  /**
   * Required fields for updating a topic.
   */
  export interface Update
    extends Partial<EditableFields>,
      ContentMetadata.Update {}

  /**
   * Fields returned from the backend.
   */
  export interface Response extends Fields, ContentMetadata.Response {
    chapterData?: Record<string, Chapter.Summary>;
  }

  /**
   * Serialized fields.
   */
  export interface Get extends Fields, ContentMetadata.Get {
    chapterData: Chapter.Summary[];
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
    photo: string | null;
    title: string;
  }
}
