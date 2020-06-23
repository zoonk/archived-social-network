import { db, timestamp } from '@zoonk/firebase/db';
import { Comment, Profile } from '@zoonk/models';
import { appLanguage, logEdit } from '@zoonk/utils';
import { serializeComment } from '../serializers';
import { updatePost } from './posts';

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

export const createComment = (
  comment: Comment.Create,
): Promise<firebase.firestore.DocumentReference> => {
  logEdit('comments', 'add', comment.createdById);
  return db.collection('comments').add(comment);
};

export const getComment = async (id: string): Promise<Comment.Get | null> => {
  const snap = await db
    .doc(`comments/${id}`)
    .withConverter(commentConverter)
    .get();
  return snap.data() || null;
};

export const deleteComment = (id: string): Promise<void> => {
  return db.doc(`comments/${id}`).delete();
};

const commentsQuery = (
  limit = 10,
  userId?: string,
): firebase.firestore.Query<Comment.Get> => {
  let ref = db
    .collection('comments')
    .withConverter(commentConverter)
    .orderBy('createdAt', 'desc')
    .where('language', '==', appLanguage)
    .limit(limit);

  if (userId) {
    ref = ref.where('createdById', '==', userId);
  }

  return ref;
};

export const getComments = async (
  limit?: number,
  userId?: string,
): Promise<Comment.Get[]> => {
  const ref = await commentsQuery(limit, userId).get();
  return ref.docs.map((doc) => doc.data());
};

export const getCommentsSnapshot = async (
  last: firebase.firestore.DocumentSnapshot,
  limit?: number,
  userId?: string,
): Promise<Comment.Snapshot[]> => {
  const ref = await commentsQuery(limit, userId)
    .startAfter(last)
    .get();
  return ref.docs.map((snap) => ({ ...snap.data(), snap }));
};

export const getReplies = async (commentId: string): Promise<Comment.Get[]> => {
  const snap = await db
    .collection('comments')
    .withConverter(commentConverter)
    .where('commentId', '==', commentId)
    .orderBy('likes', 'desc')
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map((item) => item.data());
};

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

export const pinComment = (
  commentId: string,
  postId: string,
  profile: Profile.Response,
  userId: string,
): Promise<void> => {
  const data = {
    pinnedComment: commentId,
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: userId,
  };
  return updatePost(data, postId);
};

export const unpinComment = (
  postId: string,
  profile: Profile.Response,
  userId: string,
): Promise<void> => {
  const data = {
    pinnedComment: null,
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: userId,
  };
  return updatePost(data, postId);
};
