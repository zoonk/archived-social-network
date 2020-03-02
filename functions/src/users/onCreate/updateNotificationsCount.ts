import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreateNotificationUpdateCount = functions.firestore
  .document('users/{createdById}/notifications/{notId}')
  .onCreate((_, context) => {
    const { createdById } = context.params;

    return db.doc(`users/${createdById}`).update({
      notifications: admin.firestore.FieldValue.increment(1),
    });
  });
