import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Follower, Topic } from '@zoonk/models';
import { xpActions } from '../../settings';

const db = admin.firestore();

/**
 * When a topic is created, this functions adds its author
 * to the followers list.
 */
export const onCreateTopicSetupFollowers = functions.firestore
  .document('topics/{id}')
  .onCreate((snap) => {
    const { createdAt, createdBy, createdById } = snap.data() as Topic.Response;
    const follower: Follower.Response = {
      ...createdBy,
      joined: createdAt,
      xp: xpActions.created_topics,
    };

    return db.doc(`topics/${snap.id}/followers/${createdById}`).set(follower);
  });
