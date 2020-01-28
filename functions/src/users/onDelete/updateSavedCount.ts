import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onDeleteSavedUpdateCount = functions.firestore
  .document('users/{createdById}/saved/{savedId}')
  .onDelete((_, context) => {
    const { createdById } = context.params;

    return db.doc(`users/${createdById}`).update({
      saved: admin.firestore.FieldValue.increment(-1),
    });
  });
