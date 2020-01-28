import { ContentMetadata } from './content';

/**
 * Comment replies model.
 */
export namespace Reply {
  interface EditableFields {
    content: string;
  }

  interface Fields extends EditableFields {
    commentId: string;
    postId: string;
  }

  /**
   * Required fields for creating a comment reply.
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
    replies: number;
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
