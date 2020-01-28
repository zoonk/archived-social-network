import { Topic } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single topic.
 */
export const serializeTopic = (
  snap: firebase.firestore.DocumentSnapshot<Topic.Response>,
): Topic.Get => {
  const data = snap.data()!;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
