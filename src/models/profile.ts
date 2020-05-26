export interface Username {
  uid: string;
}

/**
 * User profile model
 */
export namespace Profile {
  export interface Response {
    bio: string | null;
    facebook?: string | null;
    github?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    name: string;
    photo: string | null;
    twitter?: string | null;
    username: string;
    web?: string | null;
    youtube?: string | null;
  }

  export interface Update extends Partial<Response> {}

  export interface Get {
    bio: string | null;
    facebook: string | null;
    github: string | null;
    id: string;
    instagram: string | null;
    linkedin: string | null;
    name: string;
    photo: string | null;
    twitter: string | null;
    username: string;
    web: string | null;
    youtube: string | null;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}
