import { FieldDiff } from './diff';
import { User } from './user';

/**
 * Reports model.
 */
export namespace Report {
  /**
   * Required fields for reporting an edit.
   */
  export interface Create {
    createdAt: firebase.firestore.FieldValue;
    added: FieldDiff[];
    comments: string;
    editId: string;
    removed: FieldDiff[];
    uid: string | null;
    user: User.Get | null;
  }

  export interface Response extends Omit<Create, 'createdAt'> {
    createdAt: firebase.firestore.Timestamp;
  }

  export interface Get extends Omit<Response, 'createdAt'> {
    createdAt: string;
    id: string;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
