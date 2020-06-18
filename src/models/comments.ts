import { Node } from 'slate';
import { ContentMetadata } from './content';

export namespace Comment {
  interface Fields {
    category: 'comments' | 'replies';
    commentId: string | null;
    content: string;
    groupId: string | null;
    postId: string;
    replies: number;
  }

  export interface Create
    extends Fields,
      Omit<ContentMetadata.Create, 'comments'> {}

  export interface Response extends Fields, ContentMetadata.Response {}

  export interface Get extends Omit<Fields, 'content'>, ContentMetadata.Get {
    content: Node[];
    id: string;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
