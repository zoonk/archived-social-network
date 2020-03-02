import { Profile } from './profile';

/**
 * User model
 */
export namespace User {
  export type SubscriptionPlan = 'free' | 'premium';

  /**
   * Fields returned from the backend.
   */
  export interface Response extends Profile.Response {
    notifications: number;
    role: 'admin' | 'moderator' | 'viewer';
    saved: number;
    subscription: SubscriptionPlan;
  }

  /**
   * Serialized fields.
   */
  export interface Get extends Response {
    email: string | null;
    uid: string;
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }

  /**
   * Fields a user is allowed to update.
   */
  export interface Update {
    notifications: number;
  }
}
