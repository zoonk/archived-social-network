import { Reply } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single reply.
 */
export const serializeReply = (
  snap: firebase.firestore.DocumentSnapshot<Reply.Response>,
): Reply.Get => {
  const data = snap.data()!;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    replies: 0,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
