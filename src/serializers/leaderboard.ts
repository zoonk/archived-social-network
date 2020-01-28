import { Leaderboard } from '@zoonk/models';

/**
 * Serialize a user from the leaderboard.
 */
export const serializeLeaderboard = (
  snap: firebase.firestore.DocumentSnapshot<Leaderboard.Response>,
): Leaderboard.Get => {
  const data = snap.data()!;

  return {
    ...data,
    id: snap.id,
  };
};
