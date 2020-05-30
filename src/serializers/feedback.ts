import { Feedback } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single feedback message.
 */
export const serializeFeedback = (
  snap: firebase.firestore.DocumentSnapshot<Feedback.Response>,
): Feedback.Get => {
  const data = snap.data()!;
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt, options),
    id: snap.id,
    query: JSON.parse(data.query),
  };
};
