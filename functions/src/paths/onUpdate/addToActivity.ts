import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Activity, Path, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onUpdatePathAddToActivity = functions.firestore
  .document('paths/{id}')
  .onUpdate(async (change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Path.Response;
    const after = change.after.data() as Path.Response;
    const fieldsToTrack = ['description', 'level', 'photo', 'title', 'topics'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const user = await db.doc(`profile/${after.updatedById}`).get();
    const userProfile = user.data() as Profile.Response;

    const activity: Activity.UpdatePath = {
      action: 'updated',
      after,
      before,
      category: 'paths',
      categoryId: id,
      createdById: after.updatedById,
      itemPath: `paths/${id}`,
      language: after.language,
      title: after.title,
      topics: after.topics,
      updatedAt: after.updatedAt,
      user: userProfile,
      userNotification:
        after.createdById === after.updatedById ? [] : [after.createdById],
    };

    return db.collection('activity').add(activity);
  });
