import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { difference, isEqual } from 'lodash';
import { Post } from '@zoonk/models';

const db = admin.firestore();

/**
 * Update the posts count for topics.
 */
export const onWritePostUpdateTopicCount = functions.firestore
  .document('posts/{id}')
  .onWrite((change) => {
    const batch = db.batch();
    const before = change.before.data() as Post.Response | undefined;
    const after = change.after.data() as Post.Response | undefined;
    const added = difference(after?.topics, before?.topics || []);
    const removed = difference(before?.topics, after?.topics || []);

    if (isEqual(added, removed)) {
      return false;
    }

    added.forEach((item) => {
      const ref = db.doc(`topics/${item}`);
      const data = {
        language: after?.language,
        posts: admin.firestore.FieldValue.increment(1),
        updatedAt: after?.updatedAt,
        updatedBy: after?.updatedBy,
        updatedById: after?.updatedById,
      };
      batch.set(ref, data, { merge: true });
    });

    removed.forEach((item) => {
      const ref = db.doc(`topics/${item}`);
      const data = {
        language: before?.language,
        posts: admin.firestore.FieldValue.increment(-1),
        updatedAt: before?.updatedAt,
        updatedBy: before?.updatedBy,
        updatedById: before?.updatedById,
      };
      batch.set(ref, data, { merge: true });
    });

    return batch.commit();
  });
