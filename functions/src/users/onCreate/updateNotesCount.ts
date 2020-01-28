import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreateNoteUpdateCount = functions.firestore
  .document('users/{createdById}/notes/{savedId}')
  .onCreate((_, context) => {
    const { createdById } = context.params;

    return db.doc(`users/${createdById}`).update({
      notes: admin.firestore.FieldValue.increment(1),
    });
  });
