import { pickBy } from 'lodash';
import { Chapter, Profile } from '@zoonk/models';
import { analytics, db, generateSlug, timestamp } from '@zoonk/utils';
import { serializeChapter } from '../serializers';

const chapterConverter: firebase.firestore.FirestoreDataConverter<Chapter.Get> = {
  toFirestore(data: Chapter.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Chapter.Response>,
  ): Chapter.Get {
    return serializeChapter(snapshot);
  },
};

/**
 * Add a new chapter to the database.
 */
export const createChapter = async (data: Chapter.Create): Promise<string> => {
  const slug = generateSlug(data.title);
  await db.doc(`chapters/${slug}`).set(data);
  analytics().logEvent('chapter_add', { language: data.language });
  return slug;
};

/**
 * Update an existing chapter.
 */
export const updateChapter = (
  data: Chapter.Update,
  id: string,
): Promise<void> => {
  const changes = pickBy(data, (value) => value !== undefined);
  return db.doc(`chapters/${id}`).update(changes);
};

/**
 * Get a single chapter from the database.
 */
export const getChapter = async (id: string): Promise<Chapter.Get> => {
  const snap = await db
    .doc(`chapters/${id}`)
    .withConverter(chapterConverter)
    .get();
  const data = snap.data();
  if (!data) throw new Error('chapter_not_found');
  return data;
};

/**
 * Delete a chapter from the database.
 */
export const deleteChapter = async (
  id: string,
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  // We need to update the editor ID to know who deleted this item.
  const update = {
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: editorId,
  };
  await updateChapter(update, id);
  return db.doc(`chapters/${id}`).delete();
};

/**
 * Get a list of chapters from the database.
 */
export const listChapters = async (
  pathId?: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
): Promise<Chapter.Snapshot[]> => {
  let ref = db
    .collection('chapters')
    .withConverter(chapterConverter)
    .orderBy('order', 'asc')
    .orderBy('createdAt', 'asc');

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  if (pathId) {
    ref = ref.where('pathId', '==', pathId);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};
