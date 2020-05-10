import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Activity, Topic } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateTopicAddToActivity = functions.firestore
  .document('topics/{topicId}')
  .onUpdate(async (change, context) => {
    const { topicId } = context.params;
    const before = change.before.data() as Topic.Response;
    const after = change.after.data() as Topic.Response;
    const fieldsToTrack = ['description', 'photo'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const activity: Activity.UpdateTopic = {
      action: 'updated',
      after,
      before,
      category: 'topics',
      categoryId: topicId,
      createdById: after.updatedById,
      itemPath: `topics/${topicId}`,
      language: after.language,
      title: after.title,
      topics: [topicId],
      updatedAt: after.updatedAt,
      user: after.updatedBy,
      userNotification: [],
    };

    return db.collection('activity').add(activity);
  });
