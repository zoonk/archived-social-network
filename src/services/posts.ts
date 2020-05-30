import { ChapterProgress, Dictionary, Post, Profile } from '@zoonk/models';
import {
  analytics,
  appLanguage,
  arrayRemove,
  arrayUnion,
  db,
  functions,
  generateRandomSlug,
  timestamp,
} from '@zoonk/utils';
import { serializePost } from '../serializers';
import { getChapter, updateChapter } from './chapters';
import { getTopic } from './topics';

const postConverter: firebase.firestore.FirestoreDataConverter<Post.Get> = {
  toFirestore(data: Post.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Post.Response>,
  ): Post.Get {
    return serializePost(snapshot);
  },
};

/**
 * Add a new post to the database.
 */
export const createPost = async (data: Post.Create): Promise<string> => {
  const slug = generateRandomSlug(data.title);
  await db.doc(`posts/${slug}`).set(data);
  analytics().logEvent('post_add', { language: data.language });
  return slug;
};

/**
 * Update an existing post.
 */
export const updatePost = (data: Post.Update, id: string): Promise<void> => {
  return db.doc(`posts/${id}`).update(data);
};

/**
 * Get a single post from the database.
 */
export const getPost = async (id: string): Promise<Post.Get> => {
  const snap = await db
    .doc(`posts/${id}`)
    .withConverter(postConverter)
    .get();
  const post = snap.data();

  if (!post) throw new Error('post_not_found');

  return post;
};

/**
 * Delete a post from the database.
 */
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
  return db.doc(`posts/${id}`).delete();
};

interface PostArgs {
  category?: Post.Category[];
  chapterId?: string;
  groupId?: string;
  lastVisible?: firebase.firestore.DocumentSnapshot;
  limit?: number;
  orderBy?: Post.OrderBy[];
  topicId?: string;
  userId?: string;
}

/**
 * Get a list of posts from the database.
 */
export const listPosts = async ({
  category,
  groupId,
  lastVisible,
  limit = 10,
  topicId,
  userId,
}: PostArgs): Promise<Post.Snapshot[]> => {
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

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  const snap = await ref.get();
  return snap.docs.map((doc) => ({ ...doc.data(), snap: doc }));
};

/**
 * Update order.
 */
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

/**
 * Toggle a post progress status.
 */
export const togglePostProgress = (
  postId: string,
  chapterId: string,
  category: 'examples' | 'lessons',
  current: boolean,
  user: string,
): Promise<void> => {
  const data: ChapterProgress.Create = {
    [category]: current ? arrayRemove(postId) : arrayUnion(postId),
  };

  return db
    .doc(`chapters/${chapterId}/progress/${user}`)
    .set(data, { merge: true });
};

/**
 * Mark a post as read.
 */
export const markPostAsRead = (
  postId: string,
  userId: string,
): Promise<void> => {
  return db
    .doc(`posts/${postId}/progress/${userId}`)
    .set({ read: true }, { merge: true });
};

/**
 * Get next lesson from a chapter.
 */
export const getNextLesson = async (
  chapterId: string,
  postId: string | null,
  topicId: string,
): Promise<Post.NextLesson | null> => {
  // Get the next lesson from this chapter.
  const { lessons } = await getChapter(chapterId);
  const postOrder = lessons.findIndex((lesson) => lesson === postId);
  const nextPost = postOrder + 1;

  // If there's another lesson after the current one, then use its ID.
  if (lessons[nextPost]) return { chapterId, lessonId: lessons[nextPost] };

  /**
   * If the current chapter doesn't have more lessons, then
   * get the next chapter for this topic.
   */
  const { chapters } = await getTopic(topicId);

  if (!chapters) return null;

  const chapterOrder = chapters.findIndex((chapter) => chapter === chapterId);
  const nextChapter = chapterOrder + 1;
  const nextChapterId = chapters[nextChapter];

  // Return `null` when this is the last chapter.
  if (!nextChapterId) return null;

  // Get the first lesson from the next chapter.
  return getNextLesson(nextChapterId, null, topicId);
};

/**
 * Get previous lesson from a chapter.
 */
export const getPreviousLesson = async (
  chapterId: string,
  postId: string | null,
  topicId: string,
): Promise<Post.NextLesson | null> => {
  // Get the previous lesson from this chapter.
  const { lessons } = await getChapter(chapterId);

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
  const { chapters } = await getTopic(topicId);

  if (!chapters) return null;

  const chapterOrder = chapters.findIndex((chapter) => chapter === chapterId);
  const previousChapter = chapterOrder - 1;
  const previousChapterId = chapters[previousChapter];

  // Return `null` when this is the last chapter.
  if (!previousChapterId) return null;

  // Get the last lesson from the previous chapter.
  return getPreviousLesson(previousChapterId, null, topicId);
};

// Create a cache for generated links.
const linkCache: Dictionary<Post.Link> = {};

/**
 * Get a website's metadata.
 */
export const getLinkMetadata = async (url: string): Promise<Post.Link> => {
  // If the link already exists on cache, then return it.
  if (linkCache[url]) return linkCache[url];

  const fn = await functions.httpsCallable('generateMetadata')({ url });

  // Add results to cache.
  linkCache[url] = fn.data;
  return fn.data;
};
