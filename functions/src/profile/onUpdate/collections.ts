import * as functions from 'firebase-functions';
import { getProfileChanges, updateProfile } from '../../helpers';

export const onUpdateProfileUpdateCollections = functions.firestore
  .document('profile/{uid}')
  .onUpdate(async (change, context) => {
    const profileData = getProfileChanges(change);

    if (!profileData) {
      return false;
    }

    const { uid } = context.params;
    const collections = [
      'chapters',
      'comments',
      'groups',
      'posts',
      'replies',
      'topics',
    ];
    const promises: any[] = [];

    collections.forEach((item) => {
      promises.push(updateProfile(change, item, 'created', uid));
      promises.push(updateProfile(change, item, 'updated', uid));
    });

    return Promise.all(promises);
  });
