import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual } from 'lodash';
import { Chapter, ChapterProgress } from '@zoonk/models';
import { earnXp } from '../../helpers';

const db = admin.firestore();

export const onWriteChapterProgressUpdateXP = functions.firestore
  .document('chapters/{chapterId}/progress/{userId}')
  .onWrite(async (change, context) => {
    const { chapterId, userId } = context.params;
    const before = change.before.data() as ChapterProgress.Response | undefined;
    const after = change.after.data() as ChapterProgress.Response | undefined;
    const beforePosts = [
      ...(before?.examples || []),
      ...(before?.lessons || []),
    ];
    const afterPosts = [...(after?.examples || []), ...(after?.lessons || [])];
    const count = afterPosts.length - beforePosts.length;

    // Return if there are no changes
    if (isEqual(beforePosts, afterPosts)) {
      return false;
    }

    const item = await db.doc(`chapters/${chapterId}`).get();
    const data = item.data() as Chapter.Response;

    // Don't earn XP when users complete their own content
    if (data.createdById === userId) {
      return false;
    }

    return earnXp(data, count, userId);
  });
