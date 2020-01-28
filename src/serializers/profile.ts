import { Profile } from '@zoonk/models';

/**
 * Serialize a single user profile.
 */
export const serializeProfile = (
  snap: firebase.firestore.DocumentSnapshot<Profile.Response>,
): Profile.Get => {
  const data = snap.data()!;

  return {
    ...data,
    id: snap.id,
  };
};
