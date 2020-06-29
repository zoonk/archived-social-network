import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

/**
 * When a chapter is updated, we update its data for all
 * parents items this chapter belongs to. This saves us
 * money on our Firestore bill by reducing the number of
 * reads required for loading a list of chapters.
 */
export const onUpdateChapterUpdateParentItem = functions.firestore
  .document('chapters/{id}')
  .onUpdate((change) => {
    const { id } = change.after;
    const before = change.before.data() as Chapter.Response;
    const after = change.after.data() as Chapter.Response;
    const fieldsToTrack = ['description', 'examples', 'lessons', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const examples = after.examples.length;
    const lessons = after.lessons.length;
    const summary: Chapter.Summary = {
      description: after.description.slice(0, 500),
      examples,
      id,
      lessons,
      posts: examples + lessons,
      title: after.title,
    };

    return db.doc(`topics/${after.topics[0]}`).update({
      [`chapterData.${id}`]: summary,
    });
  });
