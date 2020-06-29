import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post } from '@zoonk/models';

const db = admin.firestore();

/**
 * When an example or lesson is deleted, we should remove it
 * from the chapter progress.
 */
export const onDeletePostRemoveFromProgress = functions.firestore
  .document('posts/{id}')
  .onDelete(async (snap) => {
    const { category, chapterId } = snap.data() as Post.Response;

    // We only track progress for chapter posts.
    if (!chapterId) return false;

    // Get all users who read this post.
    const users = await db
      .collectionGroup('progress')
      .where(category, 'array-contains', snap.id)
      .get();

    // Remove this post from every user.
    const requests = users.docs.map((user) => {
      return user.ref.update({
        [category]: admin.firestore.FieldValue.arrayRemove(snap.id),
      });
    });

    return Promise.all(requests);
  });
