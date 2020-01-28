import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Profile } from '@zoonk/models';

const db = admin.firestore();

export const onCreateLeaderboardUpdateProfile = functions.firestore
  .document('{category}/{categoryId}/leaderboard/{uid}')
  .onCreate(async (snap) => {
    const profile = await db.doc(`profile/${snap.id}`).get();
    const data = profile.data() as Profile.Response;
    return snap.ref.update(data);
  });
