import { FieldDiff, Report, User } from '@zoonk/models';
import { serializeReport } from '@zoonk/serializers';
import { db, timestamp } from '@zoonk/utils';

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

/**
 * Get a list of edit reports from the backend.
 */
export const listReports = async (
  limit = 10,
  lastVisible?: firebase.firestore.DocumentSnapshot,
): Promise<Report.Snapshot[]> => {
  let ref = db
    .collection('reports')
    .withConverter(reportConverter)
    .limit(limit);

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  const req = await ref.get();
  return req.docs.map((doc) => ({ ...doc.data(), snap: doc }));
};

/**
 * Report when an edit does not follow our terms of use.
 */
export const reportEdit = (
  id: string,
  added: FieldDiff[],
  removed: FieldDiff[],
  comments: string,
  user: User.Get | null,
): Promise<firebase.firestore.DocumentReference> => {
  const data: Report.Create = {
    added,
    comments,
    createdAt: timestamp,
    editId: id,
    removed,
    user,
    uid: user ? user.uid : null,
  };
  return db.collection('reports').add(data);
};
