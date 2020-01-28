import { ContentCategory } from './activity';
import { RawFirebaseTimestamp } from './firebase';

/**
 * User notes model
 */
export namespace UserNote {
  /**
   * Required fiels for creating a note
   */
  export interface Create {
    category: ContentCategory;
    categoryId: string;
    description: string | null;
    itemPath: string;
    title: string | null;
    updatedAt: firebase.firestore.FieldValue;
  }

  /**
   * Required fields for updating a note
   */
  export interface Update
    extends Partial<Omit<Create, 'category' | 'categoryId' | 'itemPath'>> {
    updatedAt: firebase.firestore.FieldValue;
  }

  /**
   * Fields returned from the backend
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
