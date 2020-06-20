import { db, timestamp } from '@zoonk/firebase/db';
import { Report, User } from '@zoonk/models';
import { serializeReport } from '@zoonk/serializers';

const reportConverter: firebase.firestore.FirestoreDataConverter<Report.Get> = {
  toFirestore(data: Report.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Report.Response>,
  ): Report.Get {
    return serializeReport(snapshot);
  },
};

export const listReports = async (
  limit = 10,
  lastVisible?: firebase.firestore.DocumentSnapshot,
): Promise<Report.Snapshot[]> => {
  let ref = db
    .collection('reports')
    .withConverter(reportConverter)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  const req = await ref.get();
  return req.docs.map((doc) => ({ ...doc.data(), snap: doc }));
};

export const reportEdit = (
  id: string,
  comments: string,
  user: User.Get | null,
): Promise<firebase.firestore.DocumentReference> => {
  const data: Report.Create = {
    comments,
    createdAt: timestamp,
    editId: id,
    user,
    uid: user ? user.uid : null,
  };
  return db.collection('reports').add(data);
};
