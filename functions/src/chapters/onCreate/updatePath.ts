import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter, ContentSummary, Path } from '@zoonk/models';

const db = admin.firestore();

export const onCreateChapterUpdatePath = functions.firestore
  .document('chapters/{id}')
  .onCreate(async (snap) => {
    const { pathId } = snap.data() as Chapter.Response;
    const pathReq = await db.doc(`paths/${pathId}`).get();
    const { description, photo, title } = pathReq.data() as Path.Response;
    const path: ContentSummary = {
      description,
      id: pathId,
      photo,
      title,
    };

    return snap.ref.update({ path });
  });
