/**
 * Feedback messages model.
 */
export namespace Feedback {
  /**
   * Required fields for sending a feedback.
   */
  export interface Create {
    createdAt: firebase.firestore.FieldValue;
    email?: string;
    message: string;
    name: string;
    query: string;
    uid: string | null;
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
