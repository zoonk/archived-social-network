import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/performance';
import 'firebase/storage';

import { FirebaseConfig } from '@zoonk/models';
import { isProduction } from './settings';

const staging: FirebaseConfig = {
  apiKey: 'AIzaSyCNvzCjoKqNgUOkwwipciB4fHhfNf3jtRg',
  authDomain: 'zoonk-dev.firebaseapp.com',
  databaseURL: 'https://zoonk-dev.firebaseio.com',
  projectId: 'zoonk-dev',
  storageBucket: 'zoonk-dev.appspot.com',
  measurementId: 'G-PHVLSLNNX4',
  messagingSenderId: '473766783868',
  appId: '1:473766783868:web:688ae11537e26105',
};

const production: FirebaseConfig = {
  apiKey: 'AIzaSyCR4btXSoqdEe1KYp7uQq6mayuFkrT3T_8',
  authDomain: 'zoonk-production.firebaseapp.com',
  databaseURL: 'https://zoonk-production.firebaseio.com',
  projectId: 'zoonk-production',
  storageBucket: 'zoonk-production.appspot.com',
  messagingSenderId: '1051955499324',
  appId: '1:1051955499324:web:3b06206a99682aab284e39',
  measurementId: 'G-E2GV8BD0VX',
};

const firebaseConfig: FirebaseConfig = isProduction ? production : staging;

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

export const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export default firebase;
