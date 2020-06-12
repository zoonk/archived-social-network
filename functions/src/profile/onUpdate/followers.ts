import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Profile } from '@zoonk/models';
import { getProfileChanges } from '../../helpers';

const db = admin.firestore();

export const onUpdateProfileUpdateFollowers = functions.firestore
  .document('profile/{id}')
  .onUpdate(async (change) => {
    const oldData = change.before.data() as Profile.Response;
    const oldUsername = oldData.username;
    const profileData = getProfileChanges(change);

    if (!profileData) {
      return false;
    }

    const items = await db
      .collectionGroup('followers')
      .where('username', '==', oldUsername)
      .get();

    const promises = items.docs.map((doc) => doc.ref.update(profileData));
    return Promise.all(promises);
  });
