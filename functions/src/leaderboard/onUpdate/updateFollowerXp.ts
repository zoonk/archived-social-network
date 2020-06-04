import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Leaderboard } from '@zoonk/models';

const db = admin.firestore();

/**
 * We want to keep the XP up-to-date for topics. We can't use the leaderboard
 * collection directly because it has all users who edited that topic. However,
 * some users don't follow that topic and would show up as followers if we
 * would merge the leaderboard and followers collections.
 * Here, we check if an user is following this topic. If so, we update their XP.
 */
export const onUpdateLeaderboardUpdateFollowerXP = functions.firestore
  .document('topics/{id}/leaderboard/{userId}')
  .onUpdate(async (change, context) => {
    const { id, userId } = context.params;
    const data = change.after.data() as Leaderboard.Response;
    const ref = db.doc(`topics/${id}/followers/${userId}`);

    return ref
      .update({ xp: data.xp })
      .then(() => true)
      .catch((err) => err.code);
  });
