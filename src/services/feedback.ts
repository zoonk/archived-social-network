import { db } from '@zoonk/firebase/db';
import { Feedback } from '@zoonk/models';
import { serializeFeedback } from '@zoonk/serializers';

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

export const addFeedback = (
  data: Feedback.Create,
): Promise<firebase.firestore.DocumentReference> => {
  return db.collection('feedback').add(data);
};

export const listFeedback = async (
  limit = 10,
  lastVisible?: firebase.firestore.DocumentSnapshot,
): Promise<Feedback.Snapshot[]> => {
  let ref = db
    .collection('feedback')
    .withConverter(feedbackConverter)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  const req = await ref.get();
  return req.docs.map((doc) => ({ ...doc.data(), snap: doc }));
};
