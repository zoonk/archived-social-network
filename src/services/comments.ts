import { Comment } from '@zoonk/models';
import { analytics, db } from '@zoonk/utils';
import { serializeComment } from '../serializers';

const commentConverter: firebase.firestore.FirestoreDataConverter<Comment.Get> = {
  toFirestore(data: Comment.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Comment.Response>,
  ): Comment.Get {
    return serializeComment(snapshot);
  },
};

/**
 * Add a new comment to the database.
 */
export const createComment = (
  comment: Comment.Create,
): Promise<firebase.firestore.DocumentReference> => {
  analytics().logEvent('comment_add', { language: comment.language });
  return db.collection('comments').add(comment);
};

/**
 * Get a single comment from the database.
 */
export const getComment = async (id: string): Promise<Comment.Get> => {
  const snap = await db
    .doc(`comments/${id}`)
    .withConverter(commentConverter)
    .get();
  const comment = snap.data();

  if (!comment) throw new Error('comment_not_found');

  return comment;
};

/**
 * Delete a comment from the database.
 */
export const deleteComment = (id: string): Promise<void> => {
  return db.doc(`comments/${id}`).delete();
};

/**
 * Get real-time updates for comments.
 */
export const liveComments = (
  postId: string,
  onSnapshot: (snap: Comment.Get[]) => void,
): firebase.Unsubscribe => {
  return db
    .collection('comments')
    .withConverter(commentConverter)
    .where('postId', '==', postId)
    .where('category', 'in', ['comments'])
    .orderBy('likes', 'desc')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snap) => {
      const data = snap.docs.map((doc) => doc.data());
      onSnapshot(data);
    });
};

/**
 * Get real-time updates for replies.
 */
export const liveReplies = (
  commentId: string,
  onSnapshot: (snap: Comment.Get[]) => void,
): firebase.Unsubscribe => {
  return db
    .collection('comments')
    .withConverter(commentConverter)
    .where('commentId', '==', commentId)
    .orderBy('likes', 'desc')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snap) => {
      const data = snap.docs.map((doc) => doc.data());
      onSnapshot(data);
    });
};
