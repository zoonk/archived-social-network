import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreateFollowerAddToUser = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onCreate(async (snap, context) => {
    const { collection, docId, userId } = context.params;
    const doc = await db.doc(`${collection}/${docId}`).get();
    const data = doc.data();
    const follower = {
      ...data,
      id: docId,
      joined: admin.firestore.FieldValue.serverTimestamp(),
    };

    return db.doc(`users/${userId}/${collection}/${docId}`).set(follower);
  });
