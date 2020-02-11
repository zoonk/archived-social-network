import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, ContentMetadata, Profile } from '@zoonk/models';

const db = admin.firestore();

export const restoreDeletedItem = functions.https.onCall(
  async (data, context) => {
    const uid = context.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You need to login first.',
      );
    }

    if (!data.id) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'You need to provide an `id`',
      );
    }

    const activity = await db.doc(`activity/${data.id}`).get();
    const activityData = activity.data() as Activity.DeleteActions;
    const isAuthor = uid === activityData.before.createdById;
    const isPost =
      activityData.category === 'posts' &&
      activityData.before.category === 'posts';
    const isQuestion =
      activityData.category === 'posts' &&
      activityData.before.category === 'questions';

    // Only the author can restore posts can questions
    if (!isAuthor && (isPost || isQuestion)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only authors can restore a post.',
      );
    }

    const profile = await db.doc(`profile/${uid}`).get();
    const profileData = profile.data() as Profile.Response;

    const metadata: ContentMetadata.Update = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: profileData,
      updatedById: uid,
    };

    await db.doc(`${activityData.itemPath}`).set({
      ...activityData.before,
      ...metadata,
    });

    return { itemPath: activityData.itemPath };
  },
);
