import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post } from '@zoonk/models';

const db = admin.firestore();

export const onCreatePostAddToTimeline = functions.firestore
  .document('posts/{id}')
  .onCreate(async (snap) => {
    const { id } = snap;
    const { groupId, topics } = snap.data() as Post.Response;
    const users: string[] = [];

    // Get all group followers.
    if (groupId) {
      const followers = await db
        .collection(`groups/${groupId}/followers`)
        .get();

      // Add the userId to a list of users
      followers.docs.forEach((user) => {
        users.push(user.id);
      });
    }

    // Get all topic followers.
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

    // Remove duplicated users from the array.
    const uniqueUsers = [...new Set(users)];

    // Add this post to every user's timeline.
    const usersReq = uniqueUsers.map((user) => {
      const data = { ...snap.data(), id };
      return db.doc(`users/${user}/timeline/${id}`).set(data);
    });

    return Promise.all(usersReq);
  });
