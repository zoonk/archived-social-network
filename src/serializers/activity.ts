import { Activity } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single activity.
 */
export const serializeActivity = (
  snap: firebase.firestore.DocumentSnapshot<Activity.Response>,
): Activity.Get => {
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
