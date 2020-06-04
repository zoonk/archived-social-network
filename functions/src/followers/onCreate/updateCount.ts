import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreateFollowerUpdateCount = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onCreate((_, context) => {
    const { collection, docId } = context.params;
    return db
      .doc(`${collection}/${docId}`)
      .update({ followers: admin.firestore.FieldValue.increment(1) });
  });
