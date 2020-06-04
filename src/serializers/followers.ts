import { Follower } from '@zoonk/models';
import { serializeFirebaseDate } from './date';

export const serializeFollower = (
  snap: firebase.firestore.DocumentSnapshot<Follower.Response>,
): Follower.Get => {
  const data = snap.data()!;

  return {
    ...data,
    joined: serializeFirebaseDate(data.joined),
  };
};
