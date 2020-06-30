import { db, timestamp } from '@zoonk/firebase/db';
import { Chapter, Profile } from '@zoonk/models';
import { generateRandomSlug, logEdit } from '@zoonk/utils';
import { getTopic, updateTopic } from './topics';
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

export const createChapter = async (data: Chapter.Create): Promise<string> => {
  const { title } = data;
  const slug = generateRandomSlug(title);
  await db.doc(`chapters/${slug}`).set(data);
  logEdit('chapters', 'add', data.createdById);
  return slug;
};

export const updateChapter = (
  data: Chapter.Update,
  id: string,
): Promise<void> => {
  logEdit('chapters', 'edit', data.updatedById);
  return db.doc(`chapters/${id}`).update(data);
};

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

export const listChapters = async (limit = 10): Promise<Chapter.Get[]> => {
  const snap = await db
    .collection('chapters')
    .orderBy('updatedAt', 'desc')
    .limit(limit)
    .withConverter(chapterConverter)
    .get();

  return snap.docs.map((doc) => doc.data());
};

export const getChapter = async (id: string): Promise<Chapter.Get | null> => {
  const snap = await db
    .doc(`chapters/${id}`)
    .withConverter(chapterConverter)
    .get();

  return snap.data() || null;
};

export const getChapterLive = (
  id: string,
  onSnapshot: (snap: Chapter.Get | null) => void,
): firebase.Unsubscribe => {
  return db
    .doc(`chapters/${id}`)
    .withConverter(chapterConverter)
    .onSnapshot((snap) => {
      onSnapshot(snap.data() || null);
    });
};

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

export const getNextChapter = async (
  current: string,
  topicId: string,
): Promise<string | null> => {
  const topic = await getTopic(topicId);
  if (!topic) return null;

  const { chapters } = topic;
  const chapterOrder = chapters.findIndex((chapter) => chapter === current);
  const nextChapter = chapterOrder + 1;

  // If there's another chapter after the current one, then use its ID.
  return chapters[nextChapter] || null;
};

interface ChapterNav {
  next: string | null;
  previous: string | null;
}

export const getChapterNavigation = async (
  current: string,
  topicId: string,
): Promise<ChapterNav> => {
  const topic = await getTopic(topicId);
  if (!topic) return { next: null, previous: null };

  const { chapters } = topic;
  const chapterOrder = chapters.findIndex((chapter) => chapter === current);
  const previousChapter = chapterOrder - 1;
  const nextChapter = chapterOrder + 1;

  return {
    next: chapters[nextChapter] || null,
    previous: chapters[previousChapter] || null,
  };
};
