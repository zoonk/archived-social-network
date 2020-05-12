import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Activity, Group } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateGroupAddToActivity = functions.firestore
  .document('groups/{id}')
  .onUpdate(async (change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Group.Response;
    const after = change.after.data() as Group.Response;
    const fieldsToTrack = ['description', 'photo', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const activity: Activity.UpdateGroup = {
      action: 'updated',
      after,
      before,
      category: 'groups',
      categoryId: id,
      createdById: after.updatedById,
      itemPath: `groups/${id}`,
      language: after.language,
      title: after.title,
      topics: after.topics,
      updatedAt: after.updatedAt,
      user: after.updatedBy,
      userNotification:
        after.createdById === after.updatedById ? [] : [after.createdById],
    };

    return db.collection('activity').add(activity);
  });
