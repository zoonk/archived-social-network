import { Profile } from '@zoonk/models';
import { db } from '@zoonk/utils';
import { serializeProfile } from '../serializers';

const profileConverter: firebase.firestore.FirestoreDataConverter<Profile.Get> = {
  toFirestore(data: Profile.Update) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Profile.Response>,
  ): Profile.Get {
    return serializeProfile(snapshot);
  },
};

/**
 * Update a user's profile.
 */
export const updateProfile = (
  profile: Profile.Update,
  uid: string,
): Promise<void> => {
  return db.doc(`profile/${uid}`).update(profile);
};

/**
 * Get a user profile from the database.
 */
export const getProfile = async (username: string): Promise<Profile.Get> => {
  const snap = await db
    .collection('profile')
    .where('username', '==', username)
    .limit(1)
    .withConverter(profileConverter)
    .get();

  if (snap.empty) {
    throw new Error('profile_not_found');
  }

  return snap.docs[0].data();
};

/**
 * Validate if a username already exists.
 * @returns `true` if a username doesn't exist.
 * @returns `false` if a username already exists.
 */
export const validateUsername = async (username: string): Promise<boolean> => {
  const rule = /^[a-z0-9][a-z0-9_]*([.][a-z0-9_]+)*$/g;
  const isValid = rule.test(username);

  if (!isValid) {
    return false;
  }

  const doc = await db.doc(`usernames/${username}`).get();
  return !doc.exists;
};

/**
 * Create a new username.
 */
export const createUsername = (
  username: string,
  uid: string,
): Promise<void> => {
  return db.doc(`usernames/${username}`).set({ uid });
};
