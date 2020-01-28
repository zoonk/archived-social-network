import { SavedItem } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a saved item.
 */
export const serializeSavedItem = (
  snap: firebase.firestore.DocumentSnapshot<SavedItem.Response>,
): SavedItem.Get => {
  const data = snap.data()!;

  return {
    ...data,
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
