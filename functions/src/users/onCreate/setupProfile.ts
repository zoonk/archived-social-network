import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Leaderboard, Profile, User } from '@zoonk/models';

import { getNameFromEmail } from '../../helpers';

const db = admin.firestore();

/**
 * Set up a profile for new users.
 */
export const onCreateUserSetupProfile = functions.auth
  .user()
  .onCreate(async (user) => {
    const batch = db.batch();

    // Set a user's profile.
    const userInfo = {
      bio: null,
      name: getNameFromEmail(user.email || user.uid),
      photo: null,
      username: user.uid,
    };

    const userData: User.Response = {
      ...userInfo,
      notes: 0,
      notifications: 0,
      role: 'viewer',
      saved: 0,
      subscription: 'free',
    };

    const profileData: Profile.Response = {
      ...userInfo,
    };

    const leaderboardData: Leaderboard.Response = {
      ...userInfo,
      createdById: user.uid,
      xp: 1,
    };

    const userRef = db.doc(`users/${user.uid}`);
    batch.set(userRef, userData, { merge: true });

    const profileRef = db.doc(`profile/${user.uid}`);
    batch.set(profileRef, profileData, { merge: true });

    const leaderboardRef = db.doc(`leaderboard/${user.uid}`);
    batch.set(leaderboardRef, leaderboardData, { merge: true });

    return batch.commit();
  });
