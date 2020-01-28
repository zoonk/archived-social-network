import { Profile } from './profile';

/**
 * Leaderboard model
 */
export namespace Leaderboard {
  /**
   * Raw data returned from the backend.
   */
  export interface Response extends Profile.Response {
    createdById: string;
    xp: number;
  }

  /**
   * Serialized fields.
   */
  export interface Get extends Response {
    id: string;
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
