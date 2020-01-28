import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Comment } from '@zoonk/models';

const db = admin.firestore();

export const onDeleteCommentUpdateCount = functions.firestore
  .document('comments/{id}')
  .onDelete((snap) => {
    const data = snap.data() as Comment.Response;
    return db.doc(`posts/${data.postId}`).update({
      comments: admin.firestore.FieldValue.increment(-1 - data.replies),
    });
  });
