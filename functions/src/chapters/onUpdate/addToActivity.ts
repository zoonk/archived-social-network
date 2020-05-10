import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Activity, Chapter } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateChapterAddToActivity = functions.firestore
  .document('chapters/{id}')
  .onUpdate(async (change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Chapter.Response;
    const after = change.after.data() as Chapter.Response;
    const fieldsToTrack = ['description', 'photo', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const activity: Activity.UpdateChapter = {
      action: 'updated',
      after,
      before,
      category: 'chapters',
      categoryId: id,
      createdById: after.updatedById,
      itemPath: `chapters/${id}`,
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
