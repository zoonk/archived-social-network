import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Topic } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateTopicUpdateMyTopics = functions.firestore
  .document('topics/{id}')
  .onUpdate(async (change) => {
    const { id } = change.after;
    const before = change.before.data() as Topic.Response;
    const after = change.after.data() as Topic.Response;
    const fieldsToTrack = ['description', 'photo', 'title', 'updatedAt'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) return false;

    const users = await db.collection(`topics/${id}/followers`).get();
    const promises = users.docs.map((user) =>
      db.doc(`users/${user.id}/topics/${id}`).update(after),
    );
    return Promise.all(promises);
  });
