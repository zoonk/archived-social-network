import { Chapter } from './chapter';
import { RawFirebaseTimestamp } from './firebase';
import { UILanguage } from './i18n';
import { Path } from './path';
import { Post } from './post';
import { Profile } from './profile';
import { Topic } from './topic';

/**
 * Possible user actions
 */
export type UserAction = 'created' | 'updated' | 'deleted';

/**
 * Public content which everyone is allowed to update.
 */
type EditableContent = 'chapters' | 'paths' | 'posts' | 'topics';

type EditableContentType = {
  [key in EditableContent]: any;
};

/**
 * All content types (both editable and authoral)
 */
export type ContentCategory = EditableContent | 'comments' | 'replies';

/**
 * History activity model where we keep track of every change made to editable contents.
 */
export namespace Activity {
  /**
   * Common editable fields for every action.
   */
  interface Fields<T, C extends keyof EditableContentType> {
    action: UserAction;
    before: T | null;
    after: T | null;
    category: C;
    categoryId: string;
    createdById: string;
    itemPath: string;
    language: UILanguage;
    topics: string[];
    updatedAt: firebase.firestore.FieldValue;
    title: string;
    user: Profile.Response;
    userNotification: string[];
  }

  /**
   * Required fields when an item is created.
   */
  interface Create<T, C extends keyof EditableContentType>
    extends Fields<T, C> {
    action: 'created';
    before: null;
    after: T;
  }

  /**
   * Required fields when an item is edited.
   */
  interface Update<T, C extends keyof EditableContentType>
    extends Fields<T, C> {
    action: 'updated';
    before: T;
    after: T;
  }

  /**
   * Required fields when an item is deleted.
   */
  interface Delete<T, C extends keyof EditableContentType>
    extends Fields<T, C> {
    action: 'deleted';
    before: T;
    after: null;
  }

  export type CreateChapter = Create<Chapter.Response, 'chapters'>;
  export type UpdateChapter = Update<Chapter.Response, 'chapters'>;
  export type DeleteChapter = Delete<Chapter.Response, 'chapters'>;
  export type CreatePath = Create<Path.Response, 'paths'>;
  export type UpdatePath = Update<Path.Response, 'paths'>;
  export type DeletePath = Delete<Path.Response, 'paths'>;
  export type CreatePost = Create<Post.Response, 'posts'>;
  export type UpdatePost = Update<Post.Response, 'posts'>;
  export type DeletePost = Delete<Post.Response, 'posts'>;
  export type CreateTopic = Create<Topic.Response, 'topics'>;
  export type UpdateTopic = Update<Topic.Response, 'topics'>;

  export type CreateActions =
    | CreateChapter
    | CreatePath
    | CreatePost
    | CreateTopic;

  export type UpdateActions =
    | UpdateChapter
    | UpdatePath
    | UpdatePost
    | UpdateTopic;

  export type DeleteActions = DeleteChapter | DeletePath | DeletePost;

  /**
   * Fields returned from the backend when querying the /edits collection.
   */
  export type Response = Omit<
    CreateActions | UpdateActions | DeleteActions,
    'updatedAt'
  > & {
    updatedAt: RawFirebaseTimestamp;
  };

  /**
   * Serialized fields.
   */
  export type Get = Omit<Response, 'updatedAt'> & {
    id: string;
    updatedAt: string;
  };

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
