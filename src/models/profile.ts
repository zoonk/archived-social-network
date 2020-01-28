export interface Username {
  uid: string;
}

/**
 * User profile model
 */
export namespace Profile {
  /**
   * Raw data returned from the backend.
   */
  export interface Response {
    bio: string | null;
    name: string;
    photo: string | null;
    username: string;
  }

  /**
   * Required fields for updating a user's profile.
   */
  export interface Update extends Partial<Response> {}

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
