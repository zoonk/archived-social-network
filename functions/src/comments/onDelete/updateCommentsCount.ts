import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Comment } from '@zoonk/models';

const db = admin.firestore();

export const onDeleteCommentUpdateCount = functions.firestore
  .document('comments/{id}')
  .onDelete((snap) => {
    const batch = db.batch();
    const data = snap.data() as Comment.Response;
    const postRef = db.doc(`posts/${data.postId}`);
    batch.update(postRef, {
      comments: admin.firestore.FieldValue.increment(-1 - data.replies),
    });

    // Update replies count.
    if (data.commentId) {
      const commentRef = db.doc(`comments/${data.commentId}`);
      batch.update(commentRef, {
        replies: admin.firestore.FieldValue.increment(-1),
      });
    }

    return batch.commit();
  });
