import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Comment, Notification, Post } from '@zoonk/models';

const db = admin.firestore();

export const onCreateCommentSendNotification = functions.firestore
  .document('comments/{id}')
  .onCreate(async (snap) => {
    const batch = db.batch();
    const data = snap.data() as Comment.Response;
    const post = await db.doc(`posts/${data.postId}`).get();
    const postData = post.data() as Post.Response;
    const isAuthor = data.createdById === postData.createdById;

    const notification: Notification.Create = {
      action: 'created',
      activityId: null,
      category: 'comments',
      itemPath: `comments/${snap.id}`,
      language: data.language,
      title: postData.title,
      type: 'comments',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      user: data.createdBy,
    };

    if (!isAuthor) {
      const postAuthorRef = db
        .collection(`users/${postData.createdById}/notifications`)
        .doc();
      batch.set(postAuthorRef, notification);
    }

    if (data.commentId) {
      const parent = await db.doc(`comments/${data.commentId}`).get();
      const parentData = parent.data() as Comment.Response;
      const isCommentAuthor = data.createdById === parentData.createdById;

      if (!isCommentAuthor) {
        const commentAuthorRef = db
          .collection(`users/${parentData.createdById}/notifications`)
          .doc();
        batch.set(commentAuthorRef, notification);
      }
    }

    return batch.commit();
  });
