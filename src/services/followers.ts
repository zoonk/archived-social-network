import { db, timestamp } from '@zoonk/firebase/db';
import { Follower } from '@zoonk/models';
import { logFollow } from '@zoonk/utils';
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

interface FollowersQuery {
  collection: Follower.Collections;
  doc: string;
  last?: firebase.firestore.DocumentSnapshot;
  limit?: number;
}

const followersQuery = ({
  collection,
  doc,
  last,
  limit = 10,
}: FollowersQuery): firebase.firestore.Query<Follower.Get> => {
  let ref = db
    .collection(`${collection}/${doc}/followers`)
    .withConverter(followerConverter)
    .orderBy('xp', 'desc')
    .limit(limit);

  if (last) {
    ref = ref.startAfter(last);
  }

  return ref;
};

export const getFollowers = async (
  query: FollowersQuery,
): Promise<Follower.Get[]> => {
  const ref = await followersQuery(query).get();
  return ref.docs.map((doc) => doc.data());
};

export const getFollowersSnapshot = async (
  query: FollowersQuery,
): Promise<Follower.Snapshot[]> => {
  const ref = await followersQuery(query).get();
  return ref.docs.map((snap) => ({ ...snap.data(), snap }));
};

export const follow = (
  collection: Follower.Collections,
  id: string,
  userId: string,
): Promise<void> => {
  logFollow('follow', collection, id, userId);
  return db
    .doc(`${collection}/${id}/followers/${userId}`)
    .set({ joined: timestamp });
};

export const unfollow = (
  collection: Follower.Collections,
  id: string,
  userId: string,
): Promise<void> => {
  logFollow('unfollow', collection, id, userId);
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
