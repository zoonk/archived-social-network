import { Feedback, Report } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single feedback message.
 */
export const serializeFeedback = (
  snap: firebase.firestore.DocumentSnapshot<Feedback.Response>,
): Feedback.Get => {
  const data = snap.data()!;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    query: JSON.parse(data.query),
  };
};

/**
 * Serialize a single edit report.
 */
export const serializeReport = (
  snap: firebase.firestore.DocumentSnapshot<Report.Response>,
): Report.Get => {
  const data = snap.data()!;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
  };
};
