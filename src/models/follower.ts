import { Profile } from './profile';

export namespace Follower {
  export type Collections = 'groups' | 'topics';

  export interface Join {
    joined: firebase.firestore.FieldValue;
  }

  export interface Setup extends Profile.Response {
    xp: number;
  }

  export interface Request extends Join, Setup {}

  export interface Response extends Setup {
    joined: firebase.firestore.Timestamp;
  }

  export interface Get extends Omit<Response, 'joined'> {
    id: string;
    joined: string;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
