import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Post } from '@zoonk/models';
import { getPlainText } from '../../helpers';

const db = admin.firestore();

export const onWritePostUpdateChapters = functions.firestore
  .document('posts/{id}')
  .onWrite(async (change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Post.Response | undefined;
    const after = change.after.data() as Post.Response | undefined;

    // Return when a post doesn't belong to a chapter.
    if (!before?.chapterId && !after?.chapterId) {
      return false;
    }

    // Update a chapter when a post is added to it.
    if (!before?.chapterId && after?.chapterId) {
      const category =
        after.category === 'lessons' ? 'lessonData' : 'exampleData';
      const summary: Post.Summary = {
        cover: after.cover || null,
        description: getPlainText(JSON.parse(after.content)),
        id,
        title: after.title,
      };
      const changes = {
        [after.category]: admin.firestore.FieldValue.arrayUnion(id),
        [`${category}.${id}`]: summary,
      };
      return db.doc(`chapters/${after.chapterId}`).update(changes);
    }

    // Update a chapter when a post is removed from it.
    if (!after?.chapterId && before?.chapterId) {
      const category =
        before.category === 'lessons' ? 'lessonData' : 'exampleData';
      const changes = {
        [before.category]: admin.firestore.FieldValue.arrayRemove(id),
        [`${category}.${id}`]: admin.firestore.FieldValue.delete(),
      };
      return db.doc(`chapters/${before.chapterId}`).update(changes);
    }

    // Update a lesson's data when it's changed.
    const fieldsToTrack = ['content', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const hasChanges = !isEqual(beforeChanges, afterChanges);

    if (before?.chapterId && after?.chapterId && hasChanges) {
      const category =
        after.category === 'lessons' ? 'lessonData' : 'exampleData';
      const summary: Post.Summary = {
        cover: after.cover || null,
        description: getPlainText(JSON.parse(after.content)),
        id,
        title: after.title,
      };
      const changes = {
        [`${category}.${id}`]: summary,
      };
      return db.doc(`chapters/${after.chapterId}`).update(changes);
    }

    return false;
  });
