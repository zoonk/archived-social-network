import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onDeleteGroupRemovePosts = functions.firestore
  .document('groups/{id}')
  .onDelete(async (snap) => {
    const { id } = snap;
    const posts = await db
      .collection('posts')
      .where('groupId', '==', id)
      .get();

    const removeAll = posts.docs.map((post) => post.ref.delete());
    return Promise.all(removeAll);
  });
