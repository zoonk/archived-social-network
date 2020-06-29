import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter, ChapterProgress, TopicProgress } from '@zoonk/models';

const db = admin.firestore();

/**
 * When a chapter progress is updated, we also need to update
 * its topic progress. This makes easier to analyze a topic
 * progress in the frontend (avoiding the need to have multiple
 * calls - one for each chapter - to get the topic progress).
 */
export const onWriteProgressUpdateTopic = functions.firestore
  .document('chapters/{chapterId}/progress/{userId}')
  .onWrite(async (change, context) => {
    const { chapterId, userId } = context.params;
    const after = change.after.data() as ChapterProgress.Response | undefined;
    const chapter = await db.doc(`chapters/${chapterId}`).get();
    const chapterData = chapter.data() as Chapter.Response;
    const topicId = chapterData.topics[0];
    const examples = after?.examples?.length || 0;
    const lessons = after?.lessons?.length || 0;

    const payload: TopicProgress = {
      [chapterId]: {
        examples,
        lessons,
        posts: examples + lessons,
      },
    };

    return db
      .doc(`topics/${topicId}/progress/${userId}`)
      .set(payload, { merge: true });
  });
