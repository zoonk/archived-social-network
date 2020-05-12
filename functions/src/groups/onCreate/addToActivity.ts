import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Group } from '@zoonk/models';

const db = admin.firestore();

export const onCreateGroupAddToActivity = functions.firestore
  .document('groups/{id}')
  .onCreate(async (snap, context) => {
    const data = snap.data() as Group.Response;

    if (!data.createdById) {
      return false;
    }

    const { id } = context.params;
    const activity: Activity.CreateGroup = {
      action: 'created',
      before: null,
      after: data,
      category: 'groups',
      categoryId: id,
      createdById: data.createdById,
      itemPath: `groups/${id}`,
      language: data.language,
      title: data.title,
      topics: data.topics,
      updatedAt: data.updatedAt,
      user: data.updatedBy,
      userNotification: [],
    };

    return db.collection('activity').add(activity);
  });
