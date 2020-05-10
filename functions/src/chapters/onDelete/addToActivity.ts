import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Chapter } from '@zoonk/models';

const db = admin.firestore();

export const onDeleteChapterAddToActivity = functions.firestore
  .document('chapters/{id}')
  .onDelete(async (snap, context) => {
    const { id } = context.params;
    const data = snap.data() as Chapter.Response;

    const activity: Activity.DeleteChapter = {
      action: 'deleted',
      before: data,
      after: null,
      category: 'chapters',
      categoryId: id,
      createdById: data.updatedById,
      itemPath: `chapters/${id}`,
      language: data.language,
      title: data.title,
      topics: data.topics,
      updatedAt: data.updatedAt,
      user: data.updatedBy,
      userNotification:
        data.createdById === data.updatedById ? [] : [data.createdById],
    };

    return db.collection('activity').add(activity);
  });
