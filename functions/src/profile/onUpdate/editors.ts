import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getProfileChanges } from '../../helpers';

const db = admin.firestore();

export const onUpdateProfileUpdateEditors = functions.firestore
  .document('profile/{id}')
  .onUpdate(async (change) => {
    const { id } = change.after;
    const profileData = getProfileChanges(change);

    if (!profileData) {
      return false;
    }

    const posts = await db
      .collection('posts')
      .where('editors', 'array-contains', id)
      .get();

    const promises = posts.docs.map((doc) => {
      return doc.ref.update({ [`editorsData.${id}`]: profileData });
    });

    return Promise.all(promises);
  });
