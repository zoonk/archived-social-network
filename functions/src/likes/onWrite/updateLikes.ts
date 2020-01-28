import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ItemLike } from '@zoonk/models';

const db = admin.firestore();

export const onWriteCategoryLikeUpdateCount = functions.firestore
  .document('{category}/{categoryId}/likes/{createdById}')
  .onWrite((change, context) => {
    const { category, categoryId } = context.params;
    const before = change.before.data() as ItemLike | undefined;
    const after = change.after.data() as ItemLike | undefined;
    let count = 0;

    // Return if there are no changes
    if (Boolean(after?.like) === Boolean(before?.like)) {
      return false;
    }

    // Remove a like if the data became falsy
    if (!after?.like && before?.like) {
      count = -1;
    }

    // Increment a like if the data became truthy
    if (after?.like && !before?.like) {
      count = 1;
    }

    return db.doc(`${category}/${categoryId}`).update({
      likes: admin.firestore.FieldValue.increment(count),
    });
  });
