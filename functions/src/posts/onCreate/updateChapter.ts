import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter, Post } from '@zoonk/models';

const db = admin.firestore();

/**
 * Add a chapter's data when a post has a chapterId.
 */
export const onCreatePostUpdateChapter = functions.firestore
  .document('posts/{id}')
  .onCreate(async (snap) => {
    const data = snap.data() as Post.Response;

    if (!data.chapterId) {
      return false;
    }

    const chapter = await db.doc(`chapters/${data.chapterId}`).get();
    const { description, title } = chapter.data() as Chapter.Response;
    const changes: Partial<Post.Response> = {
      chapterData: { description, id: data.chapterId, title },
    };

    return snap.ref.update(changes);
  });
