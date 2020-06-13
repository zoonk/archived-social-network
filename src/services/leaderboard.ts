import { db } from '@zoonk/firebase/db';
import { Leaderboard } from '@zoonk/models';
import { serializeLeaderboard } from '../serializers';

const leaderboardConverter: firebase.firestore.FirestoreDataConverter<Leaderboard.Get> = {
  toFirestore(data: any) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Leaderboard.Response>,
  ): Leaderboard.Get {
    return serializeLeaderboard(snapshot);
  },
};

export const getLeaderboard = async (
  topicId?: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit = 5,
): Promise<Leaderboard.Snapshot[]> => {
  const path = topicId ? `topics/${topicId}/leaderboard` : 'leaderboard';

  let ref = db
    .collection(path)
    .withConverter(leaderboardConverter)
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

export const getUserLeaderboard = async (
  username: string,
): Promise<Leaderboard.Get | null> => {
  const snap = await db
    .collection('leaderboard')
    .where('username', '==', username)
    .limit(1)
    .withConverter(leaderboardConverter)
    .get();

  if (snap.empty) {
    return null;
  }

  return snap.docs[0].data();
};

export const liveUserXP = (
  id: string,
  onSnapshot: (xp: number) => void,
): firebase.Unsubscribe => {
  return db
    .doc(`leaderboard/${id}`)
    .withConverter(leaderboardConverter)
    .onSnapshot((snap) => {
      onSnapshot(snap.data()!.xp);
    });
};
