import { Chapter } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single chapter.
 */
export const serializeChapter = (
  snap: firebase.firestore.DocumentSnapshot<Chapter.Response>,
): Chapter.Get => {
  const data = snap.data()!;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
