import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Username } from '@zoonk/models';

const db = admin.firestore();

/**
 * When a new username is created, we add it to the user profile.
 */
export const onCreateUsernameUpdateProfile = functions.firestore
  .document('usernames/{username}')
  .onCreate((snap) => {
    const data = snap.data() as Username;
    return db.doc(`profile/${data.uid}`).update({ username: snap.id });
  });
