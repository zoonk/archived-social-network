import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

export const onCreateChapterUpdateParentItem = functions.firestore
  .document('chapters/{id}')
  .onCreate((snap) => {
    const { id } = snap;
    const { description, title, topics } = snap.data() as Chapter.Response;
    const summary: Chapter.Summary = {
      description: description.slice(0, 500),
      examples: 0,
      id,
      lessons: 0,
      posts: 0,
      title,
    };

    return db.doc(`topics/${topics[0]}`).update({
      chapters: admin.firestore.FieldValue.arrayUnion(id),
      [`chapterData.${id}`]: summary,
    });
  });
