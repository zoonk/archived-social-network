import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

/**
 * Sometimes, when a chapter is created, we already have lessons
 * because this chapter was restored. We should update those posts
 * to include the chapter data.
 */
export const onCreateChapterUpdatePosts = functions.firestore
  .document('chapters/{id}')
  .onCreate((snap) => {
    const {
      description,
      examples,
      lessons,
      title,
    } = snap.data() as Chapter.Response;
    const posts = [...examples, ...lessons];

    if (posts.length === 0) {
      return false;
    }

    const batch = db.batch();
    const chapterData: Chapter.Summary = {
      description,
      examples: examples.length,
      id: snap.id,
      lessons: lessons.length,
      posts: posts.length,
      title,
    };
    posts.forEach((post) => {
      const ref = db.doc(`posts/${post}`);
      batch.update(ref, { chapterId: snap.id, chapterData });
    });

    return batch.commit();
  });
