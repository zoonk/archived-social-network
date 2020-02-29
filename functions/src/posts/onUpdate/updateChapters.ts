import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Post } from '@zoonk/models';

const db = admin.firestore();

export const onUpdatePostUpdateChapters = functions.firestore
  .document('posts/{id}')
  .onUpdate(async (changes) => {
    const before = changes.before.data() as Post.Response;
    const after = changes.after.data() as Post.Response;
    const { id } = changes.after;
    const fieldsToTrack = ['content', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);
    const categories = ['examples', 'lessons'];

    if (noChanges || !categories.includes(after.category)) {
      return false;
    }

    const chapters = await db
      .collection('chapters')
      .where(after.category, 'array-contains', id)
      .get();

    const promises = chapters.docs.map((chapter) => {
      const summary: Post.Summary = {
        description: after.content,
        title: after.title,
        id,
      };
      const field = after.category === 'lessons' ? 'lessonData' : 'exampleData';
      return chapter.ref.update({ [`${field}.${id}`]: summary });
    });

    return Promise.all(promises);
  });
