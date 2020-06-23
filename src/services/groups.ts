import { db, timestamp } from '@zoonk/firebase/db';
import { Group, Profile } from '@zoonk/models';
import { appLanguage, getRandomId, generateSlug, logEdit } from '@zoonk/utils';
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

  await db.doc(`groups/${id}`).set(group);
  logEdit('groups', 'add', group.createdById);
  return id;
};

export const updateGroup = (group: Group.Update, id: string): Promise<void> => {
  logEdit('groups', 'edit', group.updatedById);
  return db.doc(`groups/${id}`).update(group);
};

export const deleteGroup = (id: string): Promise<void> => {
  return db.doc(`groups/${id}`).delete();
};

export const getGroup = async (id: string): Promise<Group.Get | null> => {
  const snap = await db
    .doc(`groups/${id}`)
    .withConverter(groupConverter)
    .get();

  return snap.data() || null;
};

export const getGroupLive = (
  id: string,
  onSnapshot: (snap: Group.Get | null) => void,
): firebase.Unsubscribe => {
  return db
    .doc(`groups/${id}`)
    .withConverter(groupConverter)
    .onSnapshot((snap) => {
      onSnapshot(snap.data() || null);
    });
};

interface GroupQuery {
  topicId?: string;
  last?: firebase.firestore.DocumentSnapshot;
  userId?: string;
  limit?: number;
}

const groupsQuery = ({
  limit = 10,
  last,
  topicId,
  userId,
}: GroupQuery): firebase.firestore.Query<Group.Get> => {
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

  if (last) {
    ref = ref.startAfter(last);
  }

  return ref;
};

export const getGroups = async (query: GroupQuery): Promise<Group.Get[]> => {
  const ref = await groupsQuery(query).get();
  return ref.docs.map((doc) => doc.data());
};

export const getGroupsSnapshot = async (
  query: GroupQuery,
): Promise<Group.Snapshot[]> => {
  const ref = await groupsQuery(query).get();
  return ref.docs.map((snap) => ({ ...snap.data(), snap }));
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
