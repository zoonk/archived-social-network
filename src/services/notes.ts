import { pickBy } from 'lodash';
import { UserNote } from '@zoonk/models';
import { analytics, db } from '@zoonk/utils';
import { serializeNote } from '../serializers';

const noteConverter: firebase.firestore.FirestoreDataConverter<UserNote.Get> = {
  toFirestore(data: any) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<UserNote.Response>,
  ): UserNote.Get {
    return serializeNote(snapshot);
  },
};

/**
 * Add a new note to the database.
 */
export const createNote = (
  note: UserNote.Create,
  uid: string,
): Promise<firebase.firestore.DocumentReference> => {
  analytics().logEvent('note_add', { category: note.category });
  return db.collection(`users/${uid}/notes`).add(note);
};

/**
 * Update an existing note.
 */
export const updateNote = (
  note: UserNote.Update,
  id: string,
  uid: string,
): Promise<void> => {
  const data = pickBy(note, (value) => value !== undefined);
  return db.doc(`users/${uid}/notes/${id}`).update(data);
};

/**
 * Delete a note from the database.
 */
export const deleteNote = (id: string, uid: string): Promise<void> => {
  return db.doc(`users/${uid}/notes/${id}`).delete();
};

/**
 * Get a single note from the database.
 */
export const getNote = async (
  id: string,
  uid: string,
): Promise<UserNote.Get> => {
  const snap = await db
    .doc(`users/${uid}/notes/${id}`)
    .withConverter(noteConverter)
    .get();
  const note = snap.data();

  if (!note) throw new Error('note_not_found');

  return note;
};

/**
 * Get real-time updates for user notes.
 */
export const liveNotes = (
  uid: string,
  itemPath: string | null,
  limit: number = 50,
  onSnapshot: (snap: UserNote.Get[]) => void,
): firebase.Unsubscribe => {
  let ref = db
    .collection(`users/${uid}/notes`)
    .withConverter(noteConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (itemPath) {
    ref = ref.where('itemPath', '==', itemPath);
  }

  return ref.onSnapshot((snap) => {
    onSnapshot(snap.docs.map((item) => item.data()));
  });
};
