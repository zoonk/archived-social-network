import { Reply } from '@zoonk/models';
import { analytics, db } from '@zoonk/utils';
import { serializeReply } from '../serializers';

const replyConverter: firebase.firestore.FirestoreDataConverter<Reply.Get> = {
  toFirestore(data: Reply.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Reply.Response>,
  ): Reply.Get {
    return serializeReply(snapshot);
  },
};

/**
 * Add a new comment reply to the database.
 */
export const createReply = (
  reply: Reply.Create,
): Promise<firebase.firestore.DocumentReference> => {
  analytics().logEvent('reply_add', { language: reply.language });
  return db.collection('replies').add(reply);
};

/**
 * Delete a comment reply from the database.
 */
export const deleteReply = (id: string): Promise<void> => {
  return db.doc(`replies/${id}`).delete();
};

/**
 * Get a single comment reply from the database.
 */
export const getReply = async (id: string): Promise<Reply.Get> => {
  const snap = await db
    .doc(`replies/${id}`)
    .withConverter(replyConverter)
    .get();
  const reply = snap.data();

  if (!reply) throw new Error('reply_not_found');

  return reply;
};

/**
 * Get real-time updates for comment replies.
 */
export const liveReplies = (
  commentId: string,
  onSnapshot: (snap: Reply.Get[]) => void,
): firebase.Unsubscribe => {
  return db
    .collection('replies')
    .withConverter(replyConverter)
    .where('commentId', '==', commentId)
    .orderBy('likes', 'desc')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snap) => {
      onSnapshot(snap.docs.map((item) => item.data()));
    });
};
