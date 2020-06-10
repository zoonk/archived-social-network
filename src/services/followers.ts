import { db, timestamp } from '@zoonk/firebase/db';
import { Follower } from '@zoonk/models';
import { serializeFollower } from '../serializers';

const followerConverter: firebase.firestore.FirestoreDataConverter<Follower.Get> = {
  toFirestore(data: Follower.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Follower.Response>,
  ): Follower.Get {
    return serializeFollower(snapshot);
  },
};

export const getFollowers = async (
  collection: Follower.Collections,
  doc: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<Follower.Snapshot[]> => {
  let ref = db
    .collection(`${collection}/${doc}/followers`)
    .withConverter(followerConverter)
    .orderBy('xp', 'desc')
    .limit(limit);

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};

export const follow = (
  collection: Follower.Collections,
  id: string,
  userId: string,
): Promise<void> => {
  return db
    .doc(`${collection}/${id}/followers/${userId}`)
    .set({ joined: timestamp });
};

export const unfollow = (
  collection: Follower.Collections,
  id: string,
  userId: string,
): Promise<void> => {
  return db.doc(`${collection}/${id}/followers/${userId}`).delete();
};

export const getFollowStatus = (
  collection: Follower.Collections,
  id: string,
  userId: string,
  onSnapshot: (joined: boolean) => void,
): firebase.Unsubscribe => {
  return db
    .doc(`${collection}/${id}/followers/${userId}`)
    .onSnapshot((snap) => {
      onSnapshot(snap.exists);
    });
};
