import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onDeleteNoteUpdateCount = functions.firestore
  .document('users/{createdById}/notes/{savedId}')
  .onDelete((_, context) => {
    const { createdById } = context.params;

    return db.doc(`users/${createdById}`).update({
      notes: admin.firestore.FieldValue.increment(-1),
    });
  });
