import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { difference } from 'lodash';
import { Chapter, Post } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateChapterUpdateLessons = functions.firestore
  .document('chapters/{id}')
  .onUpdate(async (changes) => {
    const batch = db.batch();
    const before = changes.before.data() as Chapter.Response;
    const after = changes.after.data() as Chapter.Response;
    const removed = difference(before.lessons, after.lessons);
    const added = difference(after.lessons, before.lessons);
    const noChanges = removed.length === 0 && added.length === 0;

    if (noChanges) {
      return false;
    }

    // Remove data from removed lessons.
    removed.forEach((lesson) => {
      batch.update(changes.after.ref, {
        [`lessonData.${lesson}`]: admin.firestore.FieldValue.delete(),
      });
    });

    // Get data for every lesson added to this chapter.
    const promises = added.map((item) => db.doc(`posts/${item}`).get());
    const lessons = await Promise.all(promises);
    lessons.forEach((lesson) => {
      const data = lesson.data() as Post.Response;
      const summary: Post.Summary = {
        id: lesson.id,
        description: data.content,
        title: data.title,
      };
      batch.update(changes.after.ref, {
        [`lessonData.${lesson.id}`]: summary,
      });
    });

    return batch.commit();
  });
