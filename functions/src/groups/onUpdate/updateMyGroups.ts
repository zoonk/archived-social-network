import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Group } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateGroupUpdateMyGroups = functions.firestore
  .document('groups/{id}')
  .onUpdate(async (change) => {
    const { id } = change.after;
    const after = change.after.data() as Group.Response;
    const users = await db.collection(`groups/${id}/followers`).get();
    const promises = users.docs.map((user) =>
      db.doc(`users/${user.id}/groups/${id}`).update(after),
    );
    return Promise.all(promises);
  });
