import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onDeletePostRemoveFromTimeline = functions.firestore
  .document('posts/{id}')
  .onDelete(async (snap) => {
    const { id } = snap;
    const posts = await db
      .collectionGroup('timeline')
      .where('id', '==', id)
      .get();

    if (posts.empty) return false;

    const removeAll = posts.docs.map((post) => post.ref.delete());
    return Promise.all(removeAll);
  });
