import { Notification } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a notification.
 */
export const serializeNotification = (
  snap: firebase.firestore.DocumentSnapshot<Notification.Response>,
): Notification.Get => {
  const data = snap.data()!;
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  };

  return {
    ...data,
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt, options),
  };
};
