import { Chapter } from './chapter';
import { ContentMetadata } from './content';
import { Dictionary } from './misc';
import {} from './post';
import { Profile } from './profile';
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
    pinnedPosts?: Dictionary<Chapter.Summary>;
  }

  export interface Get extends Fields, ContentMetadata.Get {
    joined: string | null;
    pinnedPosts: Chapter.Summary[];
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

export namespace GroupMember {
  export interface Join {
    joined: firebase.firestore.FieldValue;
  }

  export interface Setup extends Profile.Response {
    xp: number;
  }

  export interface Response extends Setup {
    joined: firebase.firestore.Timestamp;
  }

  export interface Get extends Omit<Response, 'joined'> {
    joined: string;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
