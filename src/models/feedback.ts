export namespace Feedback {
  export interface Query {
    action?: string;
    path?: string;
  }

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

  export interface Get extends Omit<Response, 'createdAt' | 'query'> {
    createdAt: string;
    id: string;
    query: Query;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
