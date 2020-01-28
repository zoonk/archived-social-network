import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Username } from '@zoonk/models';

const db = admin.firestore();

/**
 * When a new username is created, we remove the old one if it exists.
 */
export const onCreateUsernameRemoveTheOldOne = functions.firestore
  .document('usernames/{username}')
  .onCreate(async (snap) => {
    const data = snap.data() as Username;
    const batch = db.batch();

    // Get all usernames assigned to the current user
    const list = await db
      .collection('usernames')
      .where('uid', '==', data.uid)
      .get();

    // Remove the current item from the results
    const old = list.docs.filter((item) => item.id !== snap.id);

    // Send a request to remove all usernames which aren't used anymore.
    old.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  });
