import * as functions from 'firebase-functions';
import { updateStats } from '../helpers';
import { collectionsToTrack } from '../settings';

export const onCreateDocUpdateStats = functions.firestore
  .document('{collection}/{doc}')
  .onCreate((snap, context) => {
    const { collection } = context.params;

    if (!collectionsToTrack.includes(collection)) {
      return false;
    }

    return updateStats(collection, snap, 1);
  });
