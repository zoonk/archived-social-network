import { ContentCategory, UserAction } from './activity';
import { RawFirebaseTimestamp } from './firebase';
import { Profile } from './profile';

/**
 * User notifications model
 */
export namespace Notification {
  /**
   * Required fields when creating a notification.
   */
  export interface Create {
    action: UserAction;
    activityId: string;
    category: ContentCategory;
    itemPath: string;
    title: string;
    updatedAt: firebase.firestore.FieldValue;
    user: Profile.Response;
  }

  /**
   * Fields returned from the backend.
   */
  export interface Response extends Omit<Create, 'updatedAt'> {
    updatedAt: RawFirebaseTimestamp;
  }

  /**
   * Serialized fields
   */
  export interface Get extends Omit<Response, 'updatedAt'> {
    id: string;
    updatedAt: string;
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
