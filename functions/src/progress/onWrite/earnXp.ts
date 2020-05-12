import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post, PostProgress } from '@zoonk/models';
import { earnXp } from '../../helpers';

const db = admin.firestore();

export const onWritePostProgressEarnXp = functions.firestore
  .document('posts/{postId}/progress/{userId}')
  .onWrite(async (change, context) => {
    const { postId, userId } = context.params;
    const before = change.before.data() as PostProgress | undefined;
    const after = change.after.data() as PostProgress | undefined;
    const beforeRead = Number(before?.read) || 0;
    const afterRead = Number(after?.read) || 0;
    const count = afterRead - beforeRead;

    if (count === 0) return false;

    const post = await db.doc(`posts/${postId}`).get();
    const data = post.data() as Post.Response;

    if (userId === data.createdById) return false;

    return earnXp(data, count, userId, data.groupId);
  });
