import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onDeleteFollowerUpdateMemberCount = functions.firestore
  .document('groups/{groupId}/followers/{userId}')
  .onDelete((_, context) => {
    const { groupId } = context.params;
    return db
      .doc(`groups/${groupId}`)
      .update({ members: admin.firestore.FieldValue.increment(-1) });
  });
