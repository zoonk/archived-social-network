import { Chapter } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single chapter.
 */
export const serializeChapter = (
  snap: firebase.firestore.DocumentSnapshot<Chapter.Response>,
): Chapter.Get => {
  const data = snap.data()!;
  const { examples, exampleData, lessons, lessonData } = data;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    exampleData: examples.map(
      (example) => exampleData?.[example] || ({} as any),
    ),
    lessonData: lessons.map((lesson) => lessonData?.[lesson] || ({} as any)),
    id: snap.id,
    posts: data.examples.length + data.lessons.length,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
