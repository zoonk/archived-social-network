import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Chapter } from '@zoonk/models';

const db = admin.firestore();

export const onDeleteChapterUpdateCount = functions.firestore
  .document('chapters/{id}')
  .onDelete((snap) => {
    const data = snap.data() as Chapter.Response;
    return db.doc(`paths/${data.pathId}`).update({
      chapters: admin.firestore.FieldValue.increment(-1),
      examples: admin.firestore.FieldValue.increment(-data.examples),
      lessons: admin.firestore.FieldValue.increment(-data.lessons),
      posts: admin.firestore.FieldValue.increment(-data.posts),
    });
  });
