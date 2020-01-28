import { Feedback } from '@zoonk/models';
import { serializeFeedback } from '@zoonk/serializers';
import { db } from '@zoonk/utils';

const feedbackConverter: firebase.firestore.FirestoreDataConverter<Feedback.Get> = {
  toFirestore(data: Feedback.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Feedback.Response>,
  ): Feedback.Get {
    return serializeFeedback(snapshot);
  },
};

/**
 * Send a feedback message.
 */
export const addFeedback = (
  data: Feedback.Create,
): Promise<firebase.firestore.DocumentReference> => {
  return db.collection('feedback').add(data);
};

/**
 * Get a list of feedback messages from the backend.
 */
export const listFeedback = async (
  limit = 10,
  lastVisible?: firebase.firestore.DocumentSnapshot,
): Promise<Feedback.Snapshot[]> => {
  let ref = db
    .collection('feedback')
    .withConverter(feedbackConverter)
    .limit(limit);

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  const req = await ref.get();
  return req.docs.map((doc) => ({ ...doc.data(), snap: doc }));
};
