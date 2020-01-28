import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity } from '@zoonk/models';

const db = admin.firestore();

export const onCreateActivityUpdateLastActivity = functions.firestore
  .document('activity/{editId}')
  .onCreate((snap) => {
    const data = snap.data() as Activity.Response;

    if (data.action === 'deleted') {
      return false;
    }

    const batch = db.batch();
    const topicData = {
      language: data.language,
      updatedAt: data.updatedAt,
      updatedBy: data.user,
      updatedById: data.createdById,
    };

    data.topics.forEach((item) => {
      const topicRef = db.doc(`topics/${item}`);
      batch.set(topicRef, topicData, { merge: true });
    });

    return batch.commit();
  });
