export interface FirebaseConfig {
  appId: string;
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  measurementId: string;
  messagingSenderId: string;
}

/**
 * Properties we get when we deserialized a Firebase Timestamp.
 */
export interface RawFirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}
