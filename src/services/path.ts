import { pickBy } from 'lodash';
import { ListParams, Path, Profile } from '@zoonk/models';
import {
  analytics,
  appLanguage,
  db,
  generateSlug,
  timestamp,
} from '@zoonk/utils';
import { serializePath } from '../serializers';

const pathConverter: firebase.firestore.FirestoreDataConverter<Path.Get> = {
  toFirestore(data: Path.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Path.Response>,
  ): Path.Get {
    return serializePath(snapshot);
  },
};

/**
 * Add a new learning path to the database.
 */
export const createPath = async (data: Path.Create): Promise<string> => {
  const slug = generateSlug(data.title);
  analytics().logEvent('path_add', { language: data.language });
  await db.doc(`paths/${slug}`).set(data);
  return slug;
};

/**
 * Update an existing learning path.
 */
export const updatePath = (data: Path.Update, id: string): Promise<void> => {
  const changes = pickBy(data, (value) => value !== undefined);
  return db.doc(`paths/${id}`).update(changes);
};

/**
 * Get a single learning path from the database.
 */
export const getPath = async (id: string): Promise<Path.Get> => {
  const snap = await db
    .doc(`paths/${id}`)
    .withConverter(pathConverter)
    .get();
  const learningPath = snap.data();

  if (!learningPath) throw new Error('path_not_found');

  return learningPath;
};

/**
 * Delete a learning path from the database.
 */
export const deletePath = async (
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
  await updatePath(update, id);
  return db.doc(`paths/${id}`).delete();
};

/**
 * Get a list of learning paths from the database.
 */
export const listPaths = async (data: ListParams): Promise<Path.Snapshot[]> => {
  const { createdById, limit = 10, lastVisible, topicId } = data;

  let ref = db
    .collection('paths')
    .withConverter(pathConverter)
    .orderBy('likes', 'desc')
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  if (createdById) {
    ref = ref.where('createdById', '==', createdById);
  }

  if (topicId) {
    ref = ref.where('topics', 'array-contains', topicId);
  }

  // Filter by language when there are no other filters.
  if (!topicId) {
    ref = ref.where('language', '==', appLanguage);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};
