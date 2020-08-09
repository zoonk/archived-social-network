import { db, timestamp } from '@zoonk/firebase/db';
import { functions } from '@zoonk/firebase/functions';
import { Post, Profile } from '@zoonk/models';
import {
  appLanguage,
  generateRandomSlug,
  logEdit,
  logPostCreation,
} from '@zoonk/utils';
import { serializePost } from '../serializers';
import { getChapter, updateChapter } from './chapters';
import { getTopic } from './topics';

export const postConverter: firebase.firestore.FirestoreDataConverter<Post.Get> = {
  toFirestore(data: Post.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Post.Response>,
  ): Post.Get {
    return serializePost(snapshot);
  },
};

export const createPost = async (data: Post.Create): Promise<string> => {
  const slug = generateRandomSlug(data.title);
  await db.doc(`posts/${slug}`).set(data);
  logEdit(data.category, 'add', data.createdById);

  // Log how long a user took to create a post. This is used to improve the UX.
  const start = localStorage.getItem('postStart');
  if (start) {
    const end = new Date().getTime();
    const time = end - Number(start);
    logPostCreation(time, data.category);
  }

  return slug;
};

export const updatePost = (data: Post.Update, id: string): Promise<void> => {
  logEdit('posts', 'edit', data.updatedById);
  return db.doc(`posts/${id}`).update(data);
};

export const getPost = async (id: string): Promise<Post.Get | null> => {
  const snap = await db
    .doc(`posts/${id}`)
    .withConverter(postConverter)
    .get();

  return snap.data() || null;
};

export const deletePost = async (
  id: string,
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  // We need to update the editor ID to know who deleted this item.
  await updatePost(
    {
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: editorId,
    },
    id,
  );
  logEdit('posts', 'delete', editorId);
  return db.doc(`posts/${id}`).delete();
};

interface PostQuery {
  category?: Post.Category[];
  groupId?: string;
  last?: firebase.firestore.DocumentSnapshot;
  limit?: number;
  topicId?: string;
  userId?: string;
}

const postsQuery = ({
  category,
  groupId,
  last,
  limit = 10,
  topicId,
  userId,
}: PostQuery): firebase.firestore.Query<Post.Get> => {
  let ref = db
    .collection('posts')
    .withConverter(postConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (category?.includes('posts') && !category?.includes('lessons')) {
    category.push('lessons');
  }

  // Filter by category
  if (category) {
    ref = ref.where('category', 'in', category);
  }

  // Filter by topic
  if (topicId) {
    ref = ref.where('topics', 'array-contains', topicId);
  }

  // Filter by group
  if (groupId) {
    ref = ref.where('groupId', '==', groupId);
  }

  // Filter by user
  if (userId) {
    ref = ref.where('editors', 'array-contains', userId);
  }

  // Filter by language when there are no content specific-filters.
  if (!topicId && !groupId) {
    ref = ref.where('language', '==', appLanguage);
  }

  if (last) {
    ref = ref.startAfter(last);
  }

  return ref;
};

export const getPosts = async (query: PostQuery): Promise<Post.Get[]> => {
  const ref = await postsQuery(query).get();
  return ref.docs.map((doc) => doc.data());
};

export const getPostsSnapshot = async (
  query: PostQuery,
): Promise<Post.Snapshot[]> => {
  const ref = await postsQuery(query).get();
  return ref.docs.map((snap) => ({ ...snap.data(), snap }));
};

export const updatePostOrder = (
  lessons: string[],
  category: 'examples' | 'lessons',
  chapterId: string,
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  const changes = {
    [category]: lessons,
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: editorId,
  };

  return updateChapter(changes, chapterId);
};

export const getNextLesson = async (
  chapterId: string,
  postId: string | null,
  topicId: string,
): Promise<Post.NextLesson | null> => {
  // Get the next lesson from this chapter.
  const chapter = await getChapter(chapterId);

  if (!chapter) return null;

  const { lessons } = chapter;
  const postOrder = lessons.findIndex((lesson) => lesson === postId);
  const nextPost = postOrder + 1;

  // If there's another lesson after the current one, then use its ID.
  if (lessons[nextPost]) return { chapterId, lessonId: lessons[nextPost] };

  /**
   * If the current chapter doesn't have more lessons, then
   * get the next chapter for this topic.
   */
  const topic = await getTopic(topicId);
  if (!topic?.chapters) return null;

  const chapterOrder = topic.chapters.findIndex((item) => item === chapterId);
  const nextChapter = chapterOrder + 1;
  const nextChapterId = topic.chapters[nextChapter];

  // Return `null` when this is the last chapter.
  if (!nextChapterId) return null;

  // Get the first lesson from the next chapter.
  return getNextLesson(nextChapterId, null, topicId);
};

export const getPreviousLesson = async (
  chapterId: string,
  postId: string | null,
  topicId: string,
): Promise<Post.NextLesson | null> => {
  // Get the previous lesson from this chapter.
  const chapter = await getChapter(chapterId);

  if (!chapter) return null;

  const { lessons } = chapter;

  // If there's no post ID, then get the last lesson from this chapter.
  if (!postId) {
    const lastLesson = lessons[lessons.length - 1];
    return { chapterId, lessonId: lastLesson };
  }

  const postOrder = lessons.findIndex((lesson) => lesson === postId);
  const previousPost = postOrder - 1;

  // If there's another lesson before the current one, then use its ID.
  if (lessons[previousPost]) {
    return { chapterId, lessonId: lessons[previousPost] };
  }

  /**
   * If the current chapter doesn't have a previous lesson, then
   * get the previous chapter for this topic.
   */
  const topic = await getTopic(topicId);
  if (!topic?.chapters) return null;

  const chapterOrder = topic.chapters.findIndex((item) => item === chapterId);
  const previousChapter = chapterOrder - 1;
  const previousChapterId = topic.chapters[previousChapter];

  // Return `null` when this is the last chapter.
  if (!previousChapterId) return null;

  // Get the last lesson from the previous chapter.
  return getPreviousLesson(previousChapterId, null, topicId);
};

// Create a cache for generated links.
const linkCache: Record<string, Post.Link> = {};

export const getLinkMetadata = async (url: string): Promise<Post.Link> => {
  // If the link already exists on cache, then return it.
  if (linkCache[url]) return linkCache[url];

  const fn = await functions.httpsCallable('generateMetadata')({ url });

  // Add results to cache.
  linkCache[url] = fn.data;
  return fn.data;
};

export const getTimeline = async (
  userId: string,
  lastVisible?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<Post.Snapshot[]> => {
  let ref = db
    .collection(`users/${userId}/timeline`)
    .withConverter(postConverter)
    .where('language', '==', appLanguage)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  const snap = await ref.get();
  return snap.docs.map((doc) => ({ ...doc.data(), snap: doc }));
};
