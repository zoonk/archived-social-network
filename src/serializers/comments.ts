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
    content: JSON.parse(data.content),
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
