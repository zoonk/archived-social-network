import { Notification, User } from '@zoonk/models';
import { db, entries } from '@zoonk/utils';
import { serializeNotification } from '../serializers';

const notificationConverter: firebase.firestore.FirestoreDataConverter<Notification.Get> = {
  toFirestore(data: any) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Notification.Response>,
  ): Notification.Get {
    return serializeNotification(snapshot);
  },
};

/**
 * Set the notification count to `0`.
 */
export const resetNotificationCount = (uid: string) => {
  return db.doc(`users/${uid}`).update({ notifications: 0 });
};

/**
 * Get a list of notifications from the database.
 */
export const listNotifications = async (
  uid: string,
  settings: User.NotificationSettings,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<Notification.Snapshot[]> => {
  let ref = db
    .collection(`users/${uid}/notifications`)
    .withConverter(notificationConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  const contentTypes: Notification.RequestType[] = ['none'];

  /**
   * Users can enable/disable notifications for certain kinds of content.
   * We check what content types are enabled for `app` to filter them
   * during our request to the backend.
   */
  entries(settings).forEach(([key, value]) => {
    const isEnabled = value.includes('app');
    if (isEnabled) contentTypes.push(key);
  });

  ref = ref.where('type', 'in', contentTypes);

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};
