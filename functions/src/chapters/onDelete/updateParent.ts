import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

/**
 * Remove chapter from parent item when it's deleted.
 */
export const onDeleteChapterUpdateParent = functions.firestore
  .document('chapters/{id}')
  .onDelete((snap) => {
    const { id } = snap;
    const { topics } = snap.data() as Chapter.Response;

    return db.doc(`topics/${topics[0]}`).update({
      chapters: admin.firestore.FieldValue.arrayRemove(id),
      [`chapterData.${id}`]: admin.firestore.FieldValue.delete(),
    });
  });
