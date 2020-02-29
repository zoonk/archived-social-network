import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { difference } from 'lodash';
import { Chapter, Topic } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateTopicUpdateChapters = functions.firestore
  .document('topics/{id}')
  .onUpdate(async (change) => {
    const batch = db.batch();
    const before = change.before.data() as Topic.Response;
    const after = change.after.data() as Topic.Response;
    const removed = difference(before.chapters, after.chapters);
    const added = difference(after.chapters, before.chapters);
    const noChanges = removed.length === 0 && added.length === 0;

    if (noChanges) {
      return false;
    }

    // Remove data from removed chapters.
    removed.forEach((item) => {
      batch.update(change.after.ref, {
        [`chapterData.${item}`]: admin.firestore.FieldValue.delete(),
      });
    });

    // Get data for every chapter added to this topic.
    const promises = added.map((item) => db.doc(`chapters/${item}`).get());
    const chapters = await Promise.all(promises);
    chapters.forEach((chapter) => {
      const data = chapter.data() as Chapter.Response;
      const changes: Chapter.Summary = {
        id: chapter.id,
        description: data.description,
        title: data.title,
      };
      batch.update(change.after.ref, {
        [`chapterData.${chapter.id}`]: changes,
      });
    });

    return batch.commit();
  });
