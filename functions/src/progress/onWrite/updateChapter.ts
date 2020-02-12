import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ChapterProgress, Post, PostProgress } from '@zoonk/models';

const db = admin.firestore();

export const onWritePostProgressUpdateChapter = functions.firestore
  .document('posts/{postId}/progress/{userId}')
  .onWrite(async (change, context) => {
    const { postId, userId } = context.params;
    const before = change.before.data() as PostProgress | undefined;
    const after = change.after.data() as PostProgress | undefined;
    let count = 0;

    // Return if there are no changes
    if (Boolean(after?.completed) === Boolean(before?.completed)) {
      return false;
    }

    // Remove an item if the data became falsy
    if (!after?.completed && before?.completed) {
      count = -1;
    }

    // Increment an item if the data became truthy
    if (after?.completed && !before?.completed) {
      count = 1;
    }

    // Get post data.
    const post = await db.doc(`posts/${postId}`).get();
    const postData = post.data() as Post.Response;
    const { increment } = admin.firestore.FieldValue;

    if (!postData.chapterId) {
      return false;
    }

    // Update the completed counter for the chapter this post belongs to.
    const ref = db.doc(`chapters/${postData.chapterId}/progress/${userId}`);
    const data: ChapterProgress.Create = {
      examples: increment(postData.category === 'examples' ? count : 0),
      lessons: increment(postData.category === 'lessons' ? count : 0),
      posts: increment(count),
    };

    return ref.set(data, { merge: true });
  });
