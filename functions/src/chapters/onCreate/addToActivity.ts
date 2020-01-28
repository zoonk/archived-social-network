import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Chapter, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onCreateChapterAddToActivity = functions.firestore
  .document('chapters/{id}')
  .onCreate(async (snap, context) => {
    const data = snap.data() as Chapter.Response;
    const { id } = context.params;

    const user = await db.doc(`profile/${data.createdById}`).get();
    const userProfile = user.data() as Profile.Response;

    const activity: Activity.CreateChapter = {
      action: 'created',
      before: null,
      after: data,
      category: 'chapters',
      categoryId: id,
      createdById: data.createdById,
      itemPath: `chapters/${id}`,
      language: data.language,
      title: data.title,
      topics: data.topics,
      updatedAt: data.updatedAt,
      user: userProfile,
      userNotification: [],
    };

    return db.collection('activity').add(activity);
  });
