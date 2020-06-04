import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getField, getOperator } from '../../helpers';

const db = admin.firestore();

/**
 * When a user starts following something, then add their posts to the timeline.
 */
export const onCreateFollowerAddToTimeline = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onCreate(async (_, context) => {
    const { collection, docId, userId } = context.params;
    const field = getField(collection);
    const operator = getOperator(collection);
    const posts = await db
      .collection('posts')
      .where(field, operator, docId)
      .orderBy('updatedAt', 'desc')
      .limit(100)
      .get();

    if (posts.empty) return false;

    const batch = db.batch();
    posts.docs.forEach((post) => {
      const ref = db.doc(`users/${userId}/timeline/${post.id}`);
      const data = { ...post.data(), id: post.id };
      batch.set(ref, data);
    });

    return batch.commit();
  });
