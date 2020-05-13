import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Group, GroupMember } from '@zoonk/models';

const db = admin.firestore();

export const onCreateFollowerAddToUser = functions.firestore
  .document('groups/{groupId}/followers/{userId}')
  .onCreate(async (snap, context) => {
    const { groupId, userId } = context.params;
    const { joined } = snap.data() as GroupMember.Response;
    const doc = await db.doc(`groups/${groupId}`).get();
    const data = doc.data() as Group.Response;
    const group = { ...data, id: groupId, joined };

    return db.doc(`users/${userId}/groups/${groupId}`).set(group);
  });
