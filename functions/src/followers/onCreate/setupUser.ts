import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GroupMember, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onCreateFollowerSetupUser = functions.firestore
  .document('groups/{groupId}/followers/{userId}')
  .onCreate(async (snap) => {
    const profile = await db.doc(`profile/${snap.id}`).get();
    const profileData = profile.data() as Profile.Response;
    const data: GroupMember.Request = {
      ...profileData,
      joined: admin.firestore.FieldValue.serverTimestamp(),
      xp: 1,
    };

    return snap.ref.update(data);
  });
