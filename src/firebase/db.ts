import firebase from './index';
import 'firebase/firestore';

export const db = firebase.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;
export const timestamp = firebase.firestore.FieldValue.serverTimestamp();
