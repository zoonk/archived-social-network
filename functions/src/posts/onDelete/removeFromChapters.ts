import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post } from '@zoonk/models';

const db = admin.firestore();

export const onDeletePostRemoveFromChapters = functions.firestore
  .document('posts/{id}')
  .onDelete(async (snap) => {
    const data = snap.data() as Post.Response;

    // Delete only examples and lessons.
    const categories = ['examples', 'lessons'];
    if (!categories.includes(data.category)) {
      return false;
    }

    const chapters = await db
      .collection('chapters')
      .where(data.category, 'array-contains', snap.id)
      .get();

    if (chapters.empty) {
      return false;
    }

    const promises: Promise<
      FirebaseFirestore.WriteResult
    >[] = chapters.docs.map((chapter) => {
      const changes = {
        [data.category]: admin.firestore.FieldValue.arrayRemove(snap.id),
      };
      return chapter.ref.update(changes);
    });

    return Promise.all(promises);
  });
