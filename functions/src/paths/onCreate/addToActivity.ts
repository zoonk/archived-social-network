import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Path, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onCreatePathAddToActivity = functions.firestore
  .document('paths/{id}')
  .onCreate(async (snap, context) => {
    const data = snap.data() as Path.Response;
    const { id } = context.params;

    const user = await db.doc(`profile/${data.createdById}`).get();
    const userProfile = user.data() as Profile.Response;

    const activity: Activity.CreatePath = {
      action: 'created',
      before: null,
      after: data,
      category: 'paths',
      categoryId: id,
      createdById: data.createdById,
      itemPath: `paths/${id}`,
      language: data.language,
      title: data.title,
      topics: data.topics,
      updatedAt: data.updatedAt,
      user: userProfile,
      userNotification: [],
    };

    return db.collection('activity').add(activity);
  });
