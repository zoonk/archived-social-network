import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Reply } from '@zoonk/models';

const db = admin.firestore();

export const onDeleteReplyUpdateCount = functions.firestore
  .document('replies/{id}')
  .onDelete(async (snap) => {
    const data = snap.data() as Reply.Response;
    const batch = db.batch();
    const postRef = db.doc(`posts/${data.postId}`);
    const commentsRef = db.doc(`comments/${data.commentId}`);

    batch.update(postRef, {
      comments: admin.firestore.FieldValue.increment(-1),
    });

    batch.update(commentsRef, {
      replies: admin.firestore.FieldValue.increment(-1),
    });

    return batch.commit();
  });
