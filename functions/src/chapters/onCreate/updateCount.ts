import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

export const onCreateChapterUpdateCount = functions.firestore
  .document('chapters/{id}')
  .onCreate((snap) => {
    const data = snap.data() as Chapter.Response;
    return db
      .doc(`paths/${data.pathId}`)
      .update({ chapters: admin.firestore.FieldValue.increment(1) });
  });
