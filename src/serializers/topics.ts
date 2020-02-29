import { Topic } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single topic.
 */
export const serializeTopic = (
  snap: firebase.firestore.DocumentSnapshot<Topic.Response>,
): Topic.Get => {
  const data = snap.data()!;
  const { chapterData } = data;

  return {
    ...data,
    chapterData: data.chapters.map(
      (chapter) => chapterData?.[chapter] || ({} as any),
    ),
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
