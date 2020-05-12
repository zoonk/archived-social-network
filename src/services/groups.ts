import { pickBy } from 'lodash';
import { Group, GroupMember, Profile, UserGroup } from '@zoonk/models';
import {
  analytics,
  appLanguage,
  db,
  getRandomId,
  generateSlug,
  timestamp,
} from '@zoonk/utils';
import {
  serializeGroup,
  serializeGroupMember,
  serializeUserGroup,
} from '../serializers';

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

const groupMemberConverter: firebase.firestore.FirestoreDataConverter<GroupMember.Get> = {
  toFirestore(data: GroupMember.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<GroupMember.Response>,
  ): GroupMember.Get {
    return serializeGroupMember(snapshot);
  },
};

const userGroupConverter: firebase.firestore.FirestoreDataConverter<UserGroup.Get> = {
  toFirestore(data: UserGroup.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<UserGroup.Response>,
  ): UserGroup.Get {
    return serializeUserGroup(snapshot);
  },
};

/**
 * Check if a group id already exists.
 */
export const validateGroup = async (id: string): Promise<boolean> => {
  const group = await db.doc(`groups/${id}`).get();
  return !group.exists;
};

/**
 * Add a new group to the database.
 */
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

/**
 * Update an existing group.
 */
export const updateGroup = (group: Group.Update, id: string): Promise<void> => {
  const data = pickBy(group, (value) => value !== undefined);
  return db.doc(`groups/${id}`).update(data);
};

/**
 * Delete an existing group.
 */
export const deleteGroup = (id: string): Promise<void> => {
  analytics().logEvent('group_delete');
  return db.doc(`groups/${id}`).delete();
};

/**
 * Get a single group from the database.
 */
export const getGroup = async (id: string): Promise<Group.Get> => {
  const snap = await db
    .doc(`groups/${id}`)
    .withConverter(groupConverter)
    .get();

  const data = snap.data();

  if (!data) {
    throw new Error('group_not_found');
  }

  return data;
};

/**
 * Get real-time data from a group
 */
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

/**
 * Get a list of groups from the database.
 */
export const listGroups = async (
  topicId?: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  createdById?: string,
  limit: number = 12,
): Promise<Group.Snapshot[]> => {
  let ref = db
    .collection('groups')
    .withConverter(groupConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (createdById) {
    ref = ref.where('createdById', '==', createdById);
  }

  if (topicId) {
    ref = ref.where('topics', 'array-contains', topicId);
  }

  // If it's not filtered by topics, then filter by language.
  if (!topicId) {
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

export const joinGroup = (
  groupId: string,
  userId: string,
  profile: Profile.Response,
): Promise<void> => {
  const payload: GroupMember.Request = { ...profile, joined: timestamp, xp: 1 };
  return db.doc(`groups/${groupId}/followers/${userId}`).set(payload);
};

export const leaveGroup = (groupId: string, userId: string): Promise<void> => {
  return db.doc(`groups/${groupId}/followers/${userId}`).delete();
};

export const getGroupMembers = async (
  groupId: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<GroupMember.Snapshot[]> => {
  let ref = db
    .collection(`groups/${groupId}/followers`)
    .withConverter(groupMemberConverter)
    .orderBy('xp', 'desc')
    .orderBy('joined', 'asc')
    .limit(limit);

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};

export const getMyGroups = async (
  userId: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<UserGroup.Snapshot[]> => {
  let ref = db
    .collection(`users/${userId}/groups`)
    .withConverter(userGroupConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};
