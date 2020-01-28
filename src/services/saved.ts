import { SavedItem } from '@zoonk/models';
import { analytics, db } from '@zoonk/utils';
import { serializeSavedItem } from '../serializers';

const savedItemConverter: firebase.firestore.FirestoreDataConverter<SavedItem.Get> = {
  toFirestore(data: any) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<SavedItem.Response>,
  ): SavedItem.Get {
    return serializeSavedItem(snapshot);
  },
};

/**
 * Save a new item to the database.
 */
export const saveItem = (
  saved: SavedItem.Create,
  uid: string,
): Promise<firebase.firestore.DocumentReference> => {
  analytics().logEvent('save_item', { category: saved.category });
  return db.collection(`users/${uid}/saved`).add(saved);
};

/**
 * Delete a saved item from the database.
 */
export const unsaveItem = (
  ref: firebase.firestore.DocumentReference,
): Promise<void> => {
  return ref.delete();
};

/**
 * Check if a user has saved an item or not.
 * @returns a callback containing a reference for the saved item.
 */
export const getSavedStatus = (
  itemPath: string,
  uid: string,
  onSnapshot: (saved: firebase.firestore.DocumentReference | undefined) => void,
): firebase.Unsubscribe => {
  return db
    .collection(`users/${uid}/saved`)
    .where('itemPath', '==', itemPath)
    .limit(1)
    .onSnapshot((snap) => {
      onSnapshot(snap.docs[0]?.ref);
    });
};

/**
 * Get a list of saved items from the database.
 */
export const listSavedItems = async (
  uid: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<SavedItem.Snapshot[]> => {
  let ref = db
    .collection(`users/${uid}/saved`)
    .withConverter(savedItemConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};
