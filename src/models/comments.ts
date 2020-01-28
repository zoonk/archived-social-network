import { ContentMetadata } from './content';

/**
 * Comments model.
 */
export namespace Comment {
  /**
   * Comment-specific fields.
   */
  interface Fields {
    content: string;
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
  export interface Get extends Fields, ContentMetadata.Get {
    id: string;
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
