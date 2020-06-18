import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Post } from '@zoonk/models';

const db = admin.firestore();

export const onWritePostUpdateGroupTimeline = functions.firestore
  .document('posts/{id}')
  .onWrite(async (change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Post.Response | undefined;
    const after = change.after.data() as Post.Response | undefined;
    const groupId = after?.groupId || before?.groupId;

    if (!groupId || !after) return false;

    const fieldsToTrack = ['content', 'subtitle', 'title', 'topics'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) return false;

    // Get all group followers.
    const followers = await db.collection(`groups/${groupId}/followers`).get();

    const usersReq = followers.docs.map((user) => {
      const data = { ...change.after.data(), id };
      const ref = db.doc(`users/${user.id}/timeline/${id}`);
      return ref.set(data);
    });

    return Promise.all(usersReq);
  });
