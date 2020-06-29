import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

/**
 * When a chapter is updated, we update its data for all
 * posts added to it. This makes easier for displaying
 * chapter-related information in the post request.
 */
export const onUpdateChapterUpdatePosts = functions.firestore
  .document('chapters/{id}')
  .onUpdate((change) => {
    const batch = db.batch();
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

    const posts = [...after.lessons, ...after.examples];
    posts.forEach((post) => {
      const ref = db.doc(`posts/${post}`);
      const summary: Chapter.Summary = {
        description: after.description.slice(0, 500),
        examples: after.examples.length,
        id,
        lessons: after.lessons.length,
        posts: posts.length,
        title: after.title,
      };
      batch.update(ref, { chapterData: summary });
    });

    return batch.commit();
  });
