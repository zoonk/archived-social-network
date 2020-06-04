import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getField, getOperator } from '../../helpers';

const db = admin.firestore();

/**
 * When unfollowing something, then remove all posts from the timeline.
 */
export const onDeleteFollowerRemovePosts = functions.firestore
  .document('{collection}/{docId}/followers/{userId}')
  .onDelete(async (_, context) => {
    const { collection, docId, userId } = context.params;

    // Find all posts assigned to this doc.
    const timeline = await db
      .collection(`users/${userId}/timeline`)
      .where(getField(collection), getOperator(collection), docId)
      .get();

    if (timeline.empty) return false;

    const removeAll = timeline.docs.map((post) => post.ref.delete());
    return Promise.all(removeAll);
  });
