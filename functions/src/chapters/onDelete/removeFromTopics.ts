import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onDeleteChapterRemoveFromTopics = functions.firestore
  .document('chapters/{id}')
  .onDelete(async (snap) => {
    const topics = await db
      .collection('topics')
      .where('chapters', 'array-contains', snap.id)
      .get();

    const promises: Promise<FirebaseFirestore.WriteResult>[] = topics.docs.map(
      (topic) =>
        topic.ref.update({
          chapters: admin.firestore.FieldValue.arrayRemove(snap.id),
        }),
    );

    return Promise.all(promises);
  });
