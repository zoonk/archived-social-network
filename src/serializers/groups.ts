import { Group } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

export const serializeGroup = (
  snap: firebase.firestore.DocumentSnapshot<Group.Response>,
): Group.Get => {
  const data = snap.data()!;
  const { joined, pinnedPosts } = data;

  return {
    ...data,
    createdAt: serializeFirebaseDate(data.createdAt),
    id: snap.id,
    joined: joined ? serializeFirebaseDate(joined) : null,
    pinnedPosts: data.pinned.map(
      (pinned) => pinnedPosts?.[pinned] || ({} as any),
    ),
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
