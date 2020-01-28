import { UserNote } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

/**
 * Serialize a single user note.
 */
export const serializeNote = (
  snap: firebase.firestore.DocumentSnapshot<UserNote.Response>,
): UserNote.Get => {
  const data = snap.data()!;

  return {
    ...data,
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
