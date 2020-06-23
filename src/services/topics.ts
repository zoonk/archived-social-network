import { db } from '@zoonk/firebase/db';
import { Topic } from '@zoonk/models';
import { appLanguage, logEdit } from '@zoonk/utils';
import { serializeTopic } from '../serializers';

const topicConverter: firebase.firestore.FirestoreDataConverter<Topic.Get> = {
  toFirestore(data: Topic.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Topic.Response>,
  ): Topic.Get {
    return serializeTopic(snapshot);
  },
};

export const createTopic = (topic: Topic.Create, id: string): Promise<void> => {
  logEdit('topics', 'add', topic.createdById);
  return db.doc(`topics/${id}`).set(topic);
};

export const updateTopic = (topic: Topic.Update, id: string): Promise<void> => {
  logEdit('topics', 'edit', topic.updatedById);
  return db.doc(`topics/${id}`).update(topic);
};

export const getTopic = async (id: string): Promise<Topic.Get | null> => {
  const snap = await db
    .doc(`topics/${id}`)
    .withConverter(topicConverter)
    .get();

  return snap.data() || null;
};

export const getTopicLive = (
  id: string,
  onSnapshot: (snap: Topic.Get | null) => void,
): firebase.Unsubscribe => {
  return db
    .doc(`topics/${id}`)
    .withConverter(topicConverter)
    .onSnapshot((snap) => {
      onSnapshot(snap.data() || null);
    });
};

interface TopicsQuery {
  last?: firebase.firestore.DocumentSnapshot;
  limit?: number;
  userId?: string;
}

const topicsQuery = ({
  last,
  limit = 10,
  userId,
}: TopicsQuery): firebase.firestore.Query<Topic.Get> => {
  let ref = db
    .collection('topics')
    .withConverter(topicConverter)
    .orderBy('likes', 'desc')
    .orderBy('posts', 'desc')
    .orderBy('updatedAt', 'desc')
    .where('language', '==', appLanguage)
    .limit(limit);

  if (userId) {
    ref = ref.where('createdById', '==', userId);
  }

  if (last) {
    ref = ref.startAfter(last);
  }

  return ref;
};

export const getTopics = async (query: TopicsQuery): Promise<Topic.Get[]> => {
  const ref = await topicsQuery(query).get();
  return ref.docs.map((snap) => snap.data());
};

export const getTopicsSnapshot = async (
  query: TopicsQuery,
): Promise<Topic.Snapshot[]> => {
  const ref = await topicsQuery(query).get();
  return ref.docs.map((snap) => ({ ...snap.data(), snap }));
};

/**
 * Validate if a topic doesn't exist yet.
 * @returns `true` if the topic doesn't exist.
 */
export const validateTopic = async (id: string): Promise<boolean> => {
  const data = await db.doc(`topics/${id}`).get();
  return !data.exists;
};

export const getFollowingTopics = async (
  userId: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<Topic.Snapshot[]> => {
  let ref = db
    .collection(`users/${userId}/topics`)
    .withConverter(topicConverter)
    .orderBy('likes', 'desc')
    .orderBy('posts', 'desc')
    .orderBy('updatedAt', 'desc')
    .where('language', '==', appLanguage)
    .limit(limit);

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};
