import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post } from '@zoonk/models';

const db = admin.firestore();

export const onCreatePostUpdateCount = functions.firestore
  .document('posts/{id}')
  .onCreate((snap) => {
    const { category, chapterId } = snap.data() as Post.Response;

    if (!chapterId) {
      return false;
    }

    const ref = db.doc(`chapters/${chapterId}`);
    const example = category === 'examples' ? 1 : 0;
    const lesson = category === 'lessons' ? 1 : 0;
    const count = {
      examples: admin.firestore.FieldValue.increment(example),
      lessons: admin.firestore.FieldValue.increment(lesson),
      posts: admin.firestore.FieldValue.increment(1),
    };

    return ref.update(count);
  });
