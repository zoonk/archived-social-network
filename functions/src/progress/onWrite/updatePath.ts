import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter, ChapterProgress, PathProgress } from '@zoonk/models';
import { toNumber } from '../../helpers';

const db = admin.firestore();

export const onWriteChapterProgressUpdatePath = functions.firestore
  .document('chapters/{chapterId}/progress/{userId}')
  .onWrite(async (change, context) => {
    const { chapterId, userId } = context.params;
    const before = change.before.data() as ChapterProgress.Response | undefined;
    const after = change.after.data() as ChapterProgress.Response | undefined;
    const exampleCount = toNumber(after?.examples) - toNumber(before?.examples);
    const lessonCount = toNumber(after?.lessons) - toNumber(before?.lessons);
    const postCount = toNumber(after?.posts) - toNumber(before?.posts);

    // Get this chapter's data.
    const chapter = await db.doc(`chapters/${chapterId}`).get();
    const chapterData = chapter.data() as Chapter.Response;
    const { increment } = admin.firestore.FieldValue;
    const data: PathProgress.Create = {
      examples: increment(exampleCount),
      lessons: increment(lessonCount),
      posts: increment(postCount),
    };

    return db
      .doc(`paths/${chapterData.pathId}/progress/${userId}`)
      .set(data, { merge: true });
  });
