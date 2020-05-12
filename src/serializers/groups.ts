import { Group, GroupMember, UserGroup } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

export const serializeGroup = (
  snap: firebase.firestore.DocumentSnapshot<Group.Response>,
): Group.Get => {
  const data = snap.data()!;
  const { pinnedPosts } = data;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    pinnedPosts: data.pinned.map(
      (pinned) => pinnedPosts?.[pinned] || ({} as any),
    ),
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};

export const serializeGroupMember = (
  snap: firebase.firestore.DocumentSnapshot<GroupMember.Response>,
): GroupMember.Get => {
  const data = snap.data()!;

  return {
    ...data,
    joined: serializeFirebaseDate(data.joined),
  };
};

export const serializeUserGroup = (
  snap: firebase.firestore.DocumentSnapshot<UserGroup.Response>,
): UserGroup.Get => {
  const data = snap.data()!;

  return {
    ...data,
    joined: serializeFirebaseDate(data.joined),
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
