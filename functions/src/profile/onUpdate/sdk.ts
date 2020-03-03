import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Profile } from '@zoonk/models';

const auth = admin.auth();

export const onUpdateProfileUpdateSDK = functions.firestore
  .document('profile/{id}')
  .onUpdate((change, context) => {
    const { id } = context.params;
    const { name, photo, username } = change.after.data() as Profile.Response;
    const updateUser = auth.updateUser(id, {
      displayName: name,
      photoURL: photo,
    });

    const updateClaims = auth.setCustomUserClaims(id, { username });

    return Promise.all([updateUser, updateClaims]);
  });
