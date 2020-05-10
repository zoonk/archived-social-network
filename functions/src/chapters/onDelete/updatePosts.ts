import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

/**
 * When a chapter is deleted, remove it from posts.
 */
export const onDeleteChapterUpdatePosts = functions.firestore
  .document('chapters/{id}')
  .onDelete((snap) => {
    const batch = db.batch();
    const { examples, lessons } = snap.data() as Chapter.Response;
    const posts = [...examples, ...lessons];

    posts.forEach((post) => {
      const ref = db.doc(`posts/${post}`);
      const changes = { chapterId: null, chapterData: null };
      batch.update(ref, changes);
    });

    return batch.commit();
  });
