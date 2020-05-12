import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Group, Post } from '@zoonk/models';

const db = admin.firestore();

/**
 * Update latest activity when a group post is updated.
 */
export const onUpdatePostUpdateGroup = functions.firestore
  .document('posts/{id}')
  .onUpdate((change) => {
    const before = change.before.data() as Post.Response;
    const after = change.after.data() as Post.Response;

    if (!after.groupId) return false;

    const fieldsToTrack = ['comments', 'content', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) return false;

    const payload: Group.Update = {
      updatedAt: after.updatedAt,
      updatedBy: after.updatedBy,
      updatedById: after.updatedById,
    };

    return db.doc(`groups/${after.groupId}`).update(payload);
  });
