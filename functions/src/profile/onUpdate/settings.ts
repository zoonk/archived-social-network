import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getProfileChanges } from '../../helpers';

const db = admin.firestore();

// Update users' profile when their data changes.
export const onUpdateProfileUpdateSettings = functions.firestore
  .document('profile/{uid}')
  .onUpdate(async (change, context) => {
    const { uid } = context.params;
    const profileData = getProfileChanges(change);

    if (!profileData) {
      return false;
    }

    return db.doc(`users/${uid}`).update(profileData);
  });
