import Delta from 'quill-delta';
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
    cover: string | null;
    delta: Delta;
    html: string;
    links: string[] | null;
    pinned: boolean;
    subtitle: string;
    title: string;
  }

  export interface Fields extends Omit<EditableFields, 'delta'> {
    pinnedComment?: string | null;
    category: Category;
    delta: string;
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
    extends Partial<Omit<EditableFields, 'delta'>>,
      ContentMetadata.Update {
    delta?: string;
    topics?: string[];
  }

  /**
   * Fields returned from the backend.
   */
  export interface Response extends Fields, ContentMetadata.Response {
    chapterData?: Chapter.Summary | null;
    groupData?: Group.Summary | null;
    editors?: string[];
    editorsData?: Dictionary<Profile.Get>;
    sites?: Link[];
  }

  /**
   * Serialized fields.
   */
  export interface Get extends Omit<Fields, 'delta'>, ContentMetadata.Get {
    chapterData?: Chapter.Summary | null;
    createdBy: Profile.Get;
    delta: Delta;
    groupData?: Group.Summary | null;
    editors: Profile.Get[];
    editorsData: Dictionary<Profile.Get>;
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
