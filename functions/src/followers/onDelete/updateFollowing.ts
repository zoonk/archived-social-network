import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * When a user stops following an item, then remove it from the user's list.
 */
export const onDeleteFollowerUpdateFollowing = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onDelete((_, context) => {
    const { collection, docId, userId } = context.params;
    return db.doc(`users/${userId}/${collection}/${docId}`).delete();
  });
