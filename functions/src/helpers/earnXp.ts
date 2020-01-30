import * as admin from 'firebase-admin';
import { ContentTypes } from '@zoonk/models';

interface LeaderboardData {
  createdById: string;
  xp: admin.firestore.FieldValue;
}

export const earnXp = (data: ContentTypes, xp?: number, user?: string) => {
  const db = admin.firestore();
  const batch = db.batch();

  /**
   * If a user ID is passed, then that user will earn those points.
   * Otherwise, they'll go to the author.
   */
  const userId = user || data.createdById;

  const newData: LeaderboardData = {
    /**
     * We need this `createdById` property to update
     * the profile data when it changes. This way,
     * we can run a `collectionQuery` to find all
     * documents this a user owns.
     */
    createdById: userId,
    xp: admin.firestore.FieldValue.increment(xp || 1),
  };

  const leaderboardRef = db.doc(`leaderboard/${userId}`);
  batch.set(leaderboardRef, newData, { merge: true });

  // Update the leaderboard for every topic.
  data.topics.forEach((topic) => {
    const topicRef = db.doc(`topics/${topic}/leaderboard/${userId}`);
    batch.set(topicRef, newData, { merge: true });
  });

  return batch.commit();
};
