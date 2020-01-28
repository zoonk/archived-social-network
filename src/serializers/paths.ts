import { Path } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single learning path.
 */
export const serializePath = (
  snap: firebase.firestore.DocumentSnapshot<Path.Response>,
): Path.Get => {
  const data = snap.data()!;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
