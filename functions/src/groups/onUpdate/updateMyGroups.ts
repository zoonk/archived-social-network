import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Group, UserGroup } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateGroupUpdateMyGroups = functions.firestore
  .document('groups/{id}')
  .onUpdate(async (change) => {
    const { id } = change.after;
    const before = change.before.data() as Group.Response;
    const after = change.after.data() as Group.Response;
    const fieldsToTrack = ['description', 'photo', 'title', 'updatedAt'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const payload: Partial<UserGroup.Request> = {
      description: after.description,
      id,
      photo: after.photo,
      title: after.title,
      updatedAt: after.updatedAt,
    };
    const users = await db.collection(`groups/${id}/followers`).get();

    const promises = users.docs.map((user) =>
      db.doc(`users/${user.id}/groups/${id}`).update(payload),
    );
    return Promise.all(promises);
  });
