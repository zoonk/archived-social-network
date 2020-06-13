import { db } from '@zoonk/firebase/db';
import { Profile } from '@zoonk/models';

export const updateProfile = (
  profile: Profile.Update,
  uid: string,
): Promise<void> => {
  return db.doc(`profile/${uid}`).update(profile);
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

export const createUsername = (
  username: string,
  uid: string,
): Promise<void> => {
  return db.doc(`usernames/${username}`).set({ uid });
};
