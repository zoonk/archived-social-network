import { Comment } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single comment.
 */
export const serializeComment = (
  snap: firebase.firestore.DocumentSnapshot<Comment.Response>,
): Comment.Get => {
  const data = snap.data()!;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    delta: JSON.parse(data.delta),
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
