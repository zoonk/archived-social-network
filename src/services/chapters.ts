import { pickBy } from 'lodash';
import { Chapter, ContentMetadata, Profile } from '@zoonk/models';
import {
  analytics,
  arrayRemove,
  arrayUnion,
  db,
  generateSlug,
  timestamp,
} from '@zoonk/utils';
import { updateTopic } from './topics';
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
  const { language, title, topics, updatedAt, updatedBy, updatedById } = data;
  const batch = db.batch();
  const slug = generateSlug(title);

  batch.set(db.doc(`chapters/${slug}`), data);

  // Add this chapter to all topics.
  topics.forEach((topic) => {
    const ref = db.doc(`topics/${topic}`);
    const changes = {
      chapters: arrayUnion(slug),
      updatedAt,
      updatedBy,
      updatedById,
    };
    batch.update(ref, changes);
  });

  await batch.commit();
  analytics().logEvent('chapter_add', { language });
  return slug;
};

/**
 * Add an existing chapter to a topic.
 */
export const addChapterToTopic = (
  chapterId: string,
  topicId: string,
  user: ContentMetadata.Update,
): Promise<void> => {
  const changes = {
    ...user,
    chapters: arrayUnion(chapterId),
  };
  return db.doc(`topics/${topicId}`).update(changes);
};

/**
 * Remove a chapter from a topic.
 */
export const removeChapterFromTopic = (
  chapterId: string,
  topicId: string,
  user: ContentMetadata.Update,
): Promise<void> => {
  const changes = {
    ...user,
    chapters: arrayRemove(chapterId),
  };
  return db.doc(`topics/${topicId}`).update(changes);
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
 * Update chapter order.
 */
export const updateChapterOrder = (
  chapters: string[],
  topicId: string,
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  const changes = {
    chapters,
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: editorId,
  };

  return updateTopic(changes, topicId);
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
 * Get real-time data from a chapter
 */
export const getChapterLive = (
  id: string,
  onSnapshot: (snap: Chapter.Get) => void,
): firebase.Unsubscribe => {
  return db
    .doc(`chapters/${id}`)
    .withConverter(chapterConverter)
    .onSnapshot((snap) => {
      if (!snap.data()) throw new Error('chapter_not_found');
      onSnapshot(snap.data()!);
    });
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
