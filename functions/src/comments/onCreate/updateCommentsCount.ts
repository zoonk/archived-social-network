import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Comment } from '@zoonk/models';

const db = admin.firestore();

export const onCreateCommentUpdateCount = functions.firestore
  .document('comments/{id}')
  .onCreate((snap) => {
    const data = snap.data() as Comment.Create;
    return db.doc(`posts/${data.postId}`).update({
      comments: admin.firestore.FieldValue.increment(1),
    });
  });
