import * as admin from 'firebase-admin';
import { ContentTypes } from '@zoonk/models';

interface LeaderboardData {
  createdById: string;
  xp: admin.firestore.FieldValue;
}

export const earnXp = (data: ContentTypes, xp?: number) => {
  const db = admin.firestore();
  const batch = db.batch();
  const newData: LeaderboardData = {
    /**
     * We need this `createdById` property to update
     * the profile data when it changes. This way,
     * we can run a `collectionQuery` to find all
     * documents this a user owns.
     */
    createdById: data.createdById,
    xp: admin.firestore.FieldValue.increment(xp || 1),
  };

  const leaderboardRef = db.doc(`leaderboard/${data.createdById}`);
  batch.set(leaderboardRef, newData, { merge: true });

  // Update the leaderboard for every topic.
  data.topics.forEach((topic) => {
    const topicRef = db.doc(`topics/${topic}/leaderboard/${data.createdById}`);
    batch.set(topicRef, newData, { merge: true });
  });

  return batch.commit();
};
