import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Group } from '@zoonk/models';

const db = admin.firestore();

export const onDeleteGroupAddToActivity = functions.firestore
  .document('groups/{id}')
  .onDelete(async (snap, context) => {
    const { id } = context.params;
    const data = snap.data() as Group.Response;

    const activity: Activity.DeleteGroup = {
      action: 'deleted',
      before: data,
      after: null,
      category: 'groups',
      categoryId: id,
      createdById: data.updatedById,
      itemPath: `groups/${id}`,
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
