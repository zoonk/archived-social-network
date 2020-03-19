import { ContentMetadata } from './content';
import { Dictionary } from './misc';
import { Profile } from './profile';
import { SearchIndex } from './search';

/**
 * Posts model.
 */
export namespace Post {
  export interface Link {
    title: string;
    url: string;
  }

  export type Category =
    | 'books'
    | 'courses'
    | 'examples'
    | 'lessons'
    | 'posts'
    | 'questions'
    | 'references';
  export type OrderBy = 'likes';

  export interface Summary {
    description: string;
    id: string;
    title: string;
  }

  export interface NextLesson {
    chapterId: string;
    lessonId: string;
  }

  export interface EditableFields {
    content: string;
    links: string[] | null;
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
  export interface Response extends Fields, ContentMetadata.Response {
    editors?: string[];
    editorsData?: Dictionary<Profile.Response>;
  }

  /**
   * Serialized fields.
   */
  export interface Get extends Fields, ContentMetadata.Get {
    editors: Profile.Get[];
    editorsData: Dictionary<Profile.Response>;
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
