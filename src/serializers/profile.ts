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
    facebook: data.facebook || null,
    github: data.github || null,
    instagram: data.instagram || null,
    linkedin: data.linkedin || null,
    twitter: data.twitter || null,
    web: data.web || null,
    youtube: data.youtube || null,
  };
};
