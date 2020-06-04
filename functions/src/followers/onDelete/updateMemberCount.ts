import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onDeleteFollowerUpdateMemberCount = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onDelete((_, context) => {
    const { collection, docId } = context.params;
    return db
      .doc(`${collection}/${docId}`)
      .update({ members: admin.firestore.FieldValue.increment(-1) });
  });
