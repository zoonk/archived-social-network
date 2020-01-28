import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getProfileChanges } from '../../helpers';

const db = admin.firestore();

export const onUpdateProfileUpdateLeaderboard = functions.firestore
  .document('profile/{uid}')
  .onUpdate(async (change, context) => {
    const { uid } = context.params;
    const profileData = getProfileChanges(change);

    if (!profileData) {
      return false;
    }

    const leaderboard = await db
      .collectionGroup('leaderboard')
      .where('createdById', '==', uid)
      .get();
    const promises: any[] = [];

    leaderboard.docs.forEach((doc) => {
      promises.push(doc.ref.update(profileData));
    });

    await Promise.all(promises);

    return true;
  });
