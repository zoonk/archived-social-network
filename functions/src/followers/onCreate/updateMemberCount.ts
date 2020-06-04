import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreateFollowerUpdateMemberCount = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onCreate((_, context) => {
    const { collection, docId } = context.params;
    return db
      .doc(`${collection}/${docId}`)
      .update({ members: admin.firestore.FieldValue.increment(1) });
  });
