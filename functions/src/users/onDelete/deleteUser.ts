import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

/**
 * When a user deletes their account we erase all their data from the database.
 * This is important for privacy reasons.
 */
export const onDeleteUser = functions.auth.user().onDelete(async (user) => {
  const batch: any[] = [];
  const actions = db.doc(`actions/${user.uid}`);
  const leaderboard = db.doc(`leaderboard/${user.uid}`);
  const profile = db.doc(`profile/${user.uid}`);
  const userData = db.doc(`users/${user.uid}`);

  batch.push(actions.delete());
  batch.push(leaderboard.delete());
  batch.push(profile.delete());
  batch.push(userData.delete());

  return Promise.all(batch);
});
