import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/performance';
import 'firebase/storage';

import { FirebaseConfig } from '@zoonk/models';

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
  databaseURL: process.env.FIREBASE_DB_URL as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.FIREBASE_MESSAGING_ID as string,
  appId: process.env.FIREBASE_APP_ID as string,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID as string,
};

// Check if the Firebase SDK has been initialized.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();

// These modules need to be imported on the client because they use `window`.
export const { analytics, performance } = firebase;

export const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;
export const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export default firebase;
