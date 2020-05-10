import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Topic } from '@zoonk/models';

const db = admin.firestore();

export const onCreateTopicAddToActivity = functions.firestore
  .document('topics/{topicId}')
  .onCreate(async (snap, context) => {
    const data = snap.data() as Topic.Response;

    if (!data.createdById) {
      return false;
    }

    const { topicId } = context.params;
    const activity: Activity.CreateTopic = {
      action: 'created',
      before: null,
      after: data,
      category: 'topics',
      categoryId: topicId,
      createdById: data.createdById,
      itemPath: `topics/${topicId}`,
      language: data.language,
      title: data.title,
      topics: [topicId],
      updatedAt: data.updatedAt,
      user: data.updatedBy,
      userNotification: [],
    };

    return db.collection('activity').add(activity);
  });
