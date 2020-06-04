import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Follower, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onCreateFollowerSetupUser = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onCreate(async (snap) => {
    const profile = await db.doc(`profile/${snap.id}`).get();
    const profileData = profile.data() as Profile.Response;
    const data: Follower.Request = {
      ...profileData,
      joined: admin.firestore.FieldValue.serverTimestamp(),
      xp: 1,
    };

    return snap.ref.update(data);
  });
