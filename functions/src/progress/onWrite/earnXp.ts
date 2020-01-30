import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post, PostProgress } from '@zoonk/models';
import { earnXp } from '../../helpers';

const db = admin.firestore();

export const onWritePostProgressUpdateXP = functions.firestore
  .document('posts/{postId}/progress/{userId}')
  .onWrite(async (change, context) => {
    const { postId, userId } = context.params;
    const before = change.before.data() as PostProgress | undefined;
    const after = change.after.data() as PostProgress | undefined;
    let count = 0;

    // Return if there are no changes
    if (Boolean(after?.completed) === Boolean(before?.completed)) {
      return false;
    }

    // Remove a point if the data became falsy
    if (!after?.completed && before?.completed) {
      count = -1;
    }

    // Increment a point if the data became truthy
    if (after?.completed && !before?.completed) {
      count = 1;
    }

    const item = await db.doc(`posts/${postId}`).get();
    const data = item.data() as Post.Response;

    // Don't earn XP when users complete their own content
    if (data.createdById === userId) {
      return false;
    }

    return earnXp(data, count, userId);
  });
