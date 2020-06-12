import { analytics } from '@zoonk/firebase/analytics';
import { db, timestamp } from '@zoonk/firebase/db';
import { Group, Profile } from '@zoonk/models';
import { appLanguage, getRandomId, generateSlug } from '@zoonk/utils';
import { serializeGroup } from '../serializers';

const groupConverter: firebase.firestore.FirestoreDataConverter<Group.Get> = {
  toFirestore(data: Group.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Group.Response>,
  ): Group.Get {
    return serializeGroup(snapshot);
  },
};

/**
 * Check if a group id already exists.
 */
export const validateGroup = async (id: string): Promise<boolean> => {
  const group = await db.doc(`groups/${id}`).get();
  return !group.exists;
};

export const createGroup = async (group: Group.Create): Promise<string> => {
  let id = generateSlug(group.title);
  const isValidSlug = await validateGroup(id);

  // If the group slug already exists, then generate a random one.
  if (!isValidSlug) {
    id = `${id}-${getRandomId()}`;
  }

  analytics().logEvent('group_add', { language: group.language });
  await db.doc(`groups/${id}`).set(group);
  return id;
};

export const updateGroup = (group: Group.Update, id: string): Promise<void> => {
  return db.doc(`groups/${id}`).update(group);
};

export const deleteGroup = (id: string): Promise<void> => {
  analytics().logEvent('group_delete');
  return db.doc(`groups/${id}`).delete();
};

export const getGroup = async (id: string): Promise<Group.Get | undefined> => {
  const snap = await db
    .doc(`groups/${id}`)
    .withConverter(groupConverter)
    .get();

  return snap.data();
};

export const getGroupLive = (
  id: string,
  onSnapshot: (snap: Group.Get) => void,
): firebase.Unsubscribe => {
  return db
    .doc(`groups/${id}`)
    .withConverter(groupConverter)
    .onSnapshot((snap) => {
      if (!snap.data()) throw new Error('group_not_found');
      onSnapshot(snap.data()!);
    });
};

interface ListGroupsArgs {
  topicId?: string;
  startAfter?: firebase.firestore.DocumentSnapshot;
  userId?: string;
  limit?: number;
}

export const listGroups = async ({
  limit = 10,
  startAfter,
  topicId,
  userId,
}: ListGroupsArgs): Promise<Group.Snapshot[]> => {
  const collection = userId ? `users/${userId}/groups` : 'groups';
  let ref = db
    .collection(collection)
    .withConverter(groupConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (topicId) {
    ref = ref.where('topics', 'array-contains', topicId);
  }

  // If it's not filtered by topics, then filter by language.
  if (!topicId && !userId) {
    ref = ref.where('language', '==', appLanguage);
  }

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};

export const updatePinOrder = (
  pinned: string[],
  groupId: string,
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  const changes = {
    pinned,
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: editorId,
  };

  return updateGroup(changes, groupId);
};
