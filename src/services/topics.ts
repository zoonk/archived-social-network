import { analytics } from '@zoonk/firebase/analytics';
import { db } from '@zoonk/firebase/db';
import { Topic } from '@zoonk/models';
import { appLanguage } from '@zoonk/utils';
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
  analytics().logEvent('topic_add', { language: topic.language });
  return db.doc(`topics/${id}`).set(topic);
};

export const updateTopic = (topic: Topic.Update, id: string): Promise<void> => {
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

export const listTopics = async (
  startAfter?: firebase.firestore.DocumentSnapshot,
  createdById?: string,
  limit: number = 12,
): Promise<Topic.Snapshot[]> => {
  let ref = db
    .collection('topics')
    .withConverter(topicConverter)
    .orderBy('likes', 'desc')
    .orderBy('posts', 'desc')
    .orderBy('updatedAt', 'desc')
    .where('language', '==', appLanguage)
    .limit(limit);

  if (createdById) {
    ref = ref.where('createdById', '==', createdById);
  }

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
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
