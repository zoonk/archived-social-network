import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ContentTypes, ItemLike } from '@zoonk/models';
import { earnXp } from '../../helpers';
import { xpActions } from '../../settings';

const db = admin.firestore();

export const onWriteCategoryLikeUpdateXP = functions.firestore
  .document('{category}/{categoryId}/likes/{createdById}')
  .onWrite(async (change, context) => {
    const { category, categoryId, createdById } = context.params;
    const before = change.before.data() as ItemLike | undefined;
    const after = change.after.data() as ItemLike | undefined;
    let xp = 0;

    // Return if there are no changes
    if (Boolean(after?.like) === Boolean(before?.like)) {
      return false;
    }

    // Remove a like if the data became falsy
    if (!after?.like && before?.like) {
      xp = -xpActions.likes;
    }

    // Increment a like if the data became truthy
    if (after?.like && !before?.like) {
      xp = xpActions.likes;
    }

    const item = await db.doc(`${category}/${categoryId}`).get();
    const data = item.data() as ContentTypes;

    // Don't earn XP when users like their own content
    if (data.createdById === createdById) {
      return false;
    }

    return earnXp(data, xp, data.createdById, (data as any).groupId);
  });
