import Delta from 'quill-delta';
import { ContentMetadata } from './content';

/**
 * Comments model.
 */
export namespace Comment {
  /**
   * Comment-specific fields.
   */
  interface Fields {
    category: 'comments' | 'replies';
    commentId: string | null;
    delta: string;
    groupId: string | null;
    html: string;
    postId: string;
    replies: number;
  }

  /**
   * Required fields for creating a comment.
   */
  export interface Create
    extends Fields,
      Omit<ContentMetadata.Create, 'comments'> {}

  /**
   * Fields returned from the backend.
   */
  export interface Response extends Fields, ContentMetadata.Response {}

  /**
   * Serialized fields.
   */
  export interface Get extends Omit<Fields, 'delta'>, ContentMetadata.Get {
    delta: Delta;
    id: string;
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
