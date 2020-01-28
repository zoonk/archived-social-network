import { Report } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

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
