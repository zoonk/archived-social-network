import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Remove a group from the users collection when it's deleted.
 */
export const onDeleteGroupUpdateMyGroups = functions.firestore
  .document('groups/{id}')
  .onDelete(async (snap) => {
    const { id } = snap;
    const users = await db.collection(`groups/${id}/followers`).get();
    const promises = users.docs.map((user) =>
      db.doc(`users/${user.id}/groups/${id}`).delete(),
    );

    return Promise.all(promises);
  });
