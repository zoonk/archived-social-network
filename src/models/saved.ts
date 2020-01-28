import { ContentCategory } from './activity';
import { RawFirebaseTimestamp } from './firebase';

/**
 * Saved items model
 */
export namespace SavedItem {
  /**
   * Required fields for saving an item.
   */
  export interface Create {
    category: ContentCategory;
    categoryId: string;
    itemPath: string;
    title: string;
    updatedAt: firebase.firestore.FieldValue;
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
