import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateChapterUpdateCount = functions.firestore
  .document('chapters/{id}')
  .onUpdate((changes) => {
    const before = changes.before.data() as Chapter.Response;
    const after = changes.after.data() as Chapter.Response;
    const exampleCount = after.examples - before.examples;
    const lessonCount = after.lessons - before.lessons;
    const postCount = after.posts - before.posts;

    return db.doc(`paths/${after.pathId}`).update({
      examples: admin.firestore.FieldValue.increment(exampleCount),
      lessons: admin.firestore.FieldValue.increment(lessonCount),
      posts: admin.firestore.FieldValue.increment(postCount),
    });
  });
