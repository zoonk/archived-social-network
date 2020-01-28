import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreateSavedUpdateCount = functions.firestore
  .document('users/{createdById}/saved/{savedId}')
  .onCreate((_, context) => {
    const { createdById } = context.params;

    return db.doc(`users/${createdById}`).update({
      saved: admin.firestore.FieldValue.increment(1),
    });
  });
