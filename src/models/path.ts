import { ContentMetadata } from './content';
import { SearchIndex } from './search';

export type ExpertLevel = 'beginner' | 'advanced' | 'pro' | 'expert';

/**
 * Learning paths model.
 */
export namespace Path {
  export interface EditableFields {
    description: string;
    level: ExpertLevel;
    photo: string | null;
    title: string;
  }

  export interface Fields extends EditableFields {
    chapters: number;
    examples: number;
    lessons: number;
    posts: number;
  }

  /**
   * Required fields for creating a learning path.
   */
  export interface Create extends Fields, ContentMetadata.Create {}

  /**
   * Required fields for updating an example.
   */
  export interface Update extends Partial<Fields>, ContentMetadata.Update {
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
