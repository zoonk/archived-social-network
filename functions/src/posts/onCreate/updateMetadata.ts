import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter, ContentSummary, Path, Post } from '@zoonk/models';

const db = admin.firestore();

export const onCreatePostUpdateMetadata = functions.firestore
  .document('posts/{id}')
  .onCreate(async (snap) => {
    const { chapterId } = snap.data() as Post.Response;

    if (!chapterId) {
      return false;
    }

    const chapterReq = await db.doc(`chapters/${chapterId}`).get();
    const chapterData = chapterReq.data() as Chapter.Response;
    const pathReq = await db.doc(`paths/${chapterData.pathId}`).get();
    const pathData = pathReq.data() as Path.Response;
    const chapter: ContentSummary = {
      description: chapterData.description,
      id: chapterId,
      photo: chapterData.photo,
      title: chapterData.title,
    };
    const path: ContentSummary = {
      description: pathData.description,
      id: chapterData.pathId,
      photo: pathData.photo,
      title: pathData.title,
    };

    return snap.ref.update({ chapter, path, pathId: chapterData.pathId });
  });
