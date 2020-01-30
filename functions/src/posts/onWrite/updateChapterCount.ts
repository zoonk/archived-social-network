import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { difference, isEqual } from 'lodash';
import { Post } from '@zoonk/models';

const db = admin.firestore();

/**
 * Update the posts count for chapters.
 */
export const onWritePostUpdateChapterCount = functions.firestore
  .document('posts/{id}')
  .onWrite((change) => {
    const batch = db.batch();
    const before = change.before.data() as Post.Response | undefined;
    const after = change.after.data() as Post.Response | undefined;
    const added = difference(after?.chapters, before?.chapters || []);
    const removed = difference(before?.chapters, after?.chapters || []);

    if (isEqual(added, removed)) {
      return false;
    }

    added.forEach((item) => {
      const ref = db.doc(`chapters/${item}`);
      const example = after?.category === 'examples' ? 1 : 0;
      const lesson = after?.category === 'lessons' ? 1 : 0;
      const data = {
        examples: admin.firestore.FieldValue.increment(example),
        lessons: admin.firestore.FieldValue.increment(lesson),
        posts: admin.firestore.FieldValue.increment(1),
      };
      batch.set(ref, data, { merge: true });
    });

    removed.forEach((item) => {
      const ref = db.doc(`chapters/${item}`);
      const example = before?.category === 'examples' ? -1 : 0;
      const lesson = before?.category === 'lessons' ? -1 : 0;
      const data = {
        examples: admin.firestore.FieldValue.increment(example),
        lessons: admin.firestore.FieldValue.increment(lesson),
        posts: admin.firestore.FieldValue.increment(-1),
      };
      batch.set(ref, data, { merge: true });
    });

    return batch.commit();
  });
