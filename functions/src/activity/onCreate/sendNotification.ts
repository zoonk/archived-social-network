import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Notification } from '@zoonk/models';

const db = admin.firestore();

export const onCreateActivitySendNotification = functions.firestore
  .document('activity/{id}')
  .onCreate((snap, context) => {
    const batch = db.batch();
    const { id } = context.params;
    const data = snap.data() as Activity.Response;

    if (data.userNotification.length === 0) {
      return false;
    }

    const notification: Notification.Create = {
      action: data.action,
      activityId: id,
      category: data.category,
      itemPath: data.itemPath,
      language: data.language,
      title: data.title,
      type: 'contentChanges',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      user: data.user,
    };

    data.userNotification.forEach((createdById) => {
      const ref = db.collection(`users/${createdById}/notifications`);
      batch.create(ref.doc(), notification);
    });

    return batch.commit();
  });
