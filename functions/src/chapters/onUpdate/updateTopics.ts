import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateChapterUpdateTopics = functions.firestore
  .document('chapters/{id}')
  .onUpdate(async (changes) => {
    const before = changes.before.data() as Chapter.Response;
    const after = changes.after.data() as Chapter.Response;
    const { id } = changes.after;
    const fieldsToTrack = ['description', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const topics = await db
      .collection('topics')
      .where('chapters', 'array-contains', id)
      .get();

    const promises = topics.docs.map((topic) => {
      const summary: Chapter.Summary = {
        description: after.description,
        title: after.title,
        id,
      };
      return topic.ref.update({ [`chapterData.${id}`]: summary });
    });

    return Promise.all(promises);
  });
