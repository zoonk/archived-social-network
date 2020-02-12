import { pickBy } from 'lodash';
import { Post, PostProgress, Profile } from '@zoonk/models';
import {
  analytics,
  appLanguage,
  db,
  generateSlug,
  timestamp,
} from '@zoonk/utils';
import { serializePost } from '../serializers';

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
  const slug = generateSlug(data.title);
  analytics().logEvent('post_add', { language: data.language });
  await db.doc(`posts/${slug}`).set(data);
  return slug;
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
  category?: Post.Category;
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
  orderBy,
  topicId,
  userId,
}: PostArgs): Promise<Post.Snapshot[]> => {
  let ref = db
    .collection('posts')
    .withConverter(postConverter)
    .limit(limit);

  // Order lessons by the user-defined order.
  if (category === 'lessons') {
    ref = ref.orderBy('order', 'asc');
  }

  if (orderBy) {
    orderBy.forEach((field) => {
      ref = ref.orderBy(field, 'desc');
    });
  }

  // When it's not a lesson, then order by date.
  if (category !== 'lessons') {
    ref = ref.orderBy('updatedAt', 'desc');
  }

  // Filter by category
  if (category) {
    ref = ref.where('category', '==', category);
  }

  // Filter by topic
  if (topicId) {
    ref = ref.where('topics', 'array-contains', topicId);
  }

  // Filter by chapter
  if (chapterId) {
    ref = ref.where('chapterId', '==', chapterId);
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
  posts: Post.Get[],
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  const batch = db.batch();
  posts.forEach((post) => {
    const ref = db.doc(`posts/${post.id}`);
    batch.update(ref, {
      order: post.order,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: editorId,
    });
  });

  return batch.commit();
};

/**
 * Toggle a post progress status.
 */
export const togglePostProgress = (
  id: string,
  current: boolean,
  user: string,
): Promise<void> => {
  const data: PostProgress = { completed: !current };
  return db.doc(`posts/${id}/progress/${user}`).set(data, { merge: true });
};

/**
 * Mark a post as read.
 */
export const readPost = (id: string, user: string): Promise<void> => {
  return togglePostProgress(id, false, user);
};
