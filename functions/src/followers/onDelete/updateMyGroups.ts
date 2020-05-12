import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * When a user stops following a group, then remove it from "my groups".
 */
export const onDeleteFollowerUpdateMyGroups = functions.firestore
  .document('groups/{id}/followers/{userId}')
  .onDelete((_, context) => {
    const { id, userId } = context.params;
    return db.doc(`users/${userId}/groups/${id}`).delete();
  });
