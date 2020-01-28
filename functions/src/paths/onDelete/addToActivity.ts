import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Path, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onDeletePathAddToActivity = functions.firestore
  .document('paths/{id}')
  .onDelete(async (snap, context) => {
    const { id } = context.params;
    const data = snap.data() as Path.Response;

    const user = await db.doc(`profile/${data.updatedById}`).get();
    const userProfile = user.data() as Profile.Response;

    const activity: Activity.DeletePath = {
      action: 'deleted',
      before: data,
      after: null,
      category: 'paths',
      categoryId: id,
      createdById: data.updatedById,
      itemPath: `paths/${id}`,
      language: data.language,
      title: data.title,
      topics: data.topics,
      updatedAt: data.updatedAt,
      user: userProfile,
      userNotification:
        data.createdById === data.updatedById ? [] : [data.createdById],
    };

    return db.collection('activity').add(activity);
  });
