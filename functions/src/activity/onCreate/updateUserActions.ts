import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity } from '@zoonk/models';

const db = admin.firestore();

export const onCreateActivityUpdateUserActions = functions.firestore
  .document('activity/{editId}')
  .onCreate((snap) => {
    const data = snap.data() as Activity.Response;
    const action = `${data.action}_${data.category}`;
    const update = {
      [action]: admin.firestore.FieldValue.increment(1),
    };

    return db.doc(`actions/${data.createdById}`).set(update, { merge: true });
  });
