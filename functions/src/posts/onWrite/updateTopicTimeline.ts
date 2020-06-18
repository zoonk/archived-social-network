import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Post } from '@zoonk/models';

const db = admin.firestore();

const getFollowersFromTopics = async (topics: string[]): Promise<string[]> => {
  const users: string[] = [];
  const topicsReq = topics.map((topic) => {
    return db.collection(`topics/${topic}/followers`).get();
  });
  const topicFollowers = await Promise.all(topicsReq);

  // For every topic, get all followers and add the userId to the list of users.
  topicFollowers.forEach((followers) => {
    followers.docs.forEach((user) => {
      users.push(user.id);
    });
  });

  return [...new Set(users)];
};

export const onWritePostUpdateTopicTimeline = functions.firestore
  .document('posts/{id}')
  .onWrite(async (change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Post.Response | undefined;
    const after = change.after.data() as Post.Response | undefined;

    if (!after) return false;

    const fieldsToTrack = ['content', 'subtitle', 'title', 'topics'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) return false;

    const topics = after?.topics || before?.topics || [];
    const removedTopics = before?.topics.filter(
      (topic) => !after?.topics.includes(topic),
    );

    // When topics are removed, then delete them from the timeline.
    if (removedTopics && removedTopics.length > 0) {
      const followers = await getFollowersFromTopics(removedTopics);
      const removeAll = followers.map((user) => {
        const ref = db.doc(`users/${user}/timeline/${id}`);
        return ref.delete();
      });
      await Promise.all(removeAll);
    }

    // Get all topic followers.
    const followers = await getFollowersFromTopics(topics);

    // Add this post to every user's timeline.
    const usersReq = followers.map((user) => {
      const data = { ...change.after.data(), id };
      const ref = db.doc(`users/${user}/timeline/${id}`);
      return ref.set(data);
    });

    return Promise.all(usersReq);
  });
