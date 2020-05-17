import { Chapter } from './chapter';
import { ContentMetadata } from './content';
import { Group } from './group';
import { Dictionary } from './misc';
import { Profile } from './profile';
import { SearchIndex } from './search';

/**
 * Posts model.
 */
export namespace Post {
  export interface Link {
    description: string | null;
    image: string | null;
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
    cover: string | null;
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
    cover: string | null;
    links: string[] | null;
    pinned: boolean;
    subtitle: string;
    title: string;
  }

  export interface Fields extends EditableFields {
    category: Category;
    chapterId: string | null;
    groupId: string | null;
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
    chapterData?: Chapter.Summary | null;
    groupData?: Group.Summary | null;
    editors?: string[];
    editorsData?: Dictionary<Profile.Response>;
    sites?: Link[];
  }

  /**
   * Serialized fields.
   */
  export interface Get extends Fields, ContentMetadata.Get {
    chapterData?: Chapter.Summary | null;
    createdBy: Profile.Get;
    groupData?: Group.Summary | null;
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
    groupId: string | null;
    photo: string | null;
    title: string;
  }
}
