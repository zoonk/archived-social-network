import * as admin from 'firebase-admin';
import { Post } from '@zoonk/models';

/**
 * Update a collection stats.
 */
export const updateStats = (
  collection: string,
  snap: admin.firestore.DocumentSnapshot,
  value: 1 | -1,
) => {
  const ref = admin.firestore().doc('admin/stats');
  const changes: any = {
    [collection]: admin.firestore.FieldValue.increment(value),
  };

  if (collection === 'posts') {
    delete changes.posts;
    const data = snap.data() as Post.Response;
    changes.timeline = admin.firestore.FieldValue.increment(value);
    changes[data.category] = admin.firestore.FieldValue.increment(value);
  }

  return ref.update(changes);
};
