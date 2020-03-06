import { pickBy } from 'lodash';
import { ChapterProgress, ContentMetadata, Post, Profile } from '@zoonk/models';
import {
  analytics,
  appLanguage,
  arrayRemove,
  arrayUnion,
  db,
  generateSlug,
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
export const createPost = async (
  data: Post.Create,
  chapterId?: string,
): Promise<string> => {
  const batch = db.batch();
  const slug = generateSlug(data.title);
  batch.set(db.doc(`posts/${slug}`), data);

  // Add this post to a chapter.
  if (chapterId) {
    const chapterRef = db.doc(`chapters/${chapterId}`);
    const changes = {
      [data.category]: arrayUnion(slug),
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy,
      updatedById: data.updatedById,
    };
    batch.update(chapterRef, changes);
  }

  analytics().logEvent('post_add', { language: data.language });
  await batch.commit();
  return slug;
};

/**
 * Add an existing post to a chapter.
 */
export const addPostToChapter = (
  postId: string,
  chapterId: string,
  category: Post.Category,
  user: ContentMetadata.Update,
): Promise<void> => {
  const changes = {
    ...user,
    [category]: arrayUnion(postId),
  };
  return db.doc(`chapters/${chapterId}`).update(changes);
};

/**
 * Remove a post from a chapter.
 */
export const removePostFromChapter = (
  postId: string,
  chapterId: string,
  category: Post.Category,
  user: ContentMetadata.Update,
): Promise<void> => {
  const changes = {
    ...user,
    [category]: arrayRemove(postId),
  };
  return db.doc(`chapters/${chapterId}`).update(changes);
};

/**
 * Update an existing post.
 */
export const updatePost = (data: Post.Update, id: string): Promise<void> => {
  const changes = pickBy(data, (value) => value !== undefined);
  return db.doc(`posts/${id}`).update(changes);
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
  chapterId,
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

  // Filter by category
  if (category) {
    ref = ref.where('category', 'in', category);
  }

  // Filter by topic
  if (topicId) {
    ref = ref.where('topics', 'array-contains', topicId);
  }

  // Filter by user
  if (userId) {
    ref = ref.where('createdById', '==', userId);
  }

  // Filter by language when there are no content specific-filters.
  if (!topicId && !chapterId) {
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
