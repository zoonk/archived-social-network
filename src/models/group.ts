import { ContentMetadata } from './content';
import { Dictionary } from './misc';
import { Post } from './post';
import { SearchIndex } from './search';

export namespace Group {
  export interface Summary {
    description: string;
    id: string;
    photo: string | null;
    title: string;
  }

  export interface EditableFields {
    description: string;
    photo: string | null;
    title: string;
  }

  interface Fields extends EditableFields {
    members: number;
    pinned: string[];
  }

  export interface Create extends Fields, ContentMetadata.Create {}

  export interface Update
    extends Partial<EditableFields>,
      ContentMetadata.Update {}

  export interface Response extends Fields, ContentMetadata.Response {
    joined?: firebase.firestore.Timestamp;
    pinnedPosts?: Dictionary<Post.Summary>;
  }

  export interface Get extends Fields, ContentMetadata.Get {
    joined: string | null;
    pinnedPosts: Post.Summary[];
    id: string;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }

  export interface Index extends SearchIndex {
    description: string;
    photo: string | null;
    title: string;
  }
}
