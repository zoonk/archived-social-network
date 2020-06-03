import { ContentCategory, UserAction } from './activity';
import { RawFirebaseTimestamp } from './firebase';
import { UILanguage } from './i18n';
import { Profile } from './profile';
import { User } from './user';

/**
 * User notifications model
 */
export namespace Notification {
  export type Type = keyof User.NotificationSettings;
  export type RequestType = Type | 'none';

  export interface Email {
    editId: string;
    name: string;
    title: string;
    username: string;
  }

  /**
   * Required fields when creating a notification.
   */
  export interface Create {
    action: UserAction;
    activityId: string | null;
    category: ContentCategory;
    itemPath: string;
    language: UILanguage;
    title: string;
    type: Type;
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
