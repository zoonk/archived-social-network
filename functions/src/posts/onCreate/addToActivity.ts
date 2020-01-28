import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Post, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onCreatePostAddToActivity = functions.firestore
  .document('posts/{id}')
  .onCreate(async (snap, context) => {
    const data = snap.data() as Post.Response;
    const { id } = context.params;

    const user = await db.doc(`profile/${data.createdById}`).get();
    const userProfile = user.data() as Profile.Response;

    const activity: Activity.CreatePost = {
      action: 'created',
      before: null,
      after: data,
      category: 'posts',
      categoryId: id,
      createdById: data.createdById,
      itemPath: `posts/${id}`,
      language: data.language,
      title: data.title,
      topics: data.topics,
      updatedAt: data.updatedAt,
      user: userProfile,
      userNotification: [],
    };

    return db.collection('activity').add(activity);
  });
