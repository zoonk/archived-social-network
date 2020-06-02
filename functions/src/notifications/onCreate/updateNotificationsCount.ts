import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Notification, User } from '@zoonk/models';

const db = admin.firestore();

export const onCreateNotificationUpdateCount = functions.firestore
  .document('users/{userId}/notifications/{notId}')
  .onCreate(async (snap, context) => {
    const { userId } = context.params;
    const data = snap.data() as Notification.Response;

    // Don't update the notification count when app notifications are disabled.
    const userRef = db.doc(`users/${userId}`);
    const user = await userRef.get();
    const userData = user.data() as User.Response;
    const isEnabled = userData.notificationSettings[data.type].includes('app');

    if (!isEnabled) return false;

    return userRef.update({
      notifications: admin.firestore.FieldValue.increment(1),
    });
  });
