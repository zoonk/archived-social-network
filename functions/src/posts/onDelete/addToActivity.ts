import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Activity, Post, Profile } from '@zoonk/models';

const db = admin.firestore();

export const onDeletePostAddToActivity = functions.firestore
  .document('posts/{id}')
  .onDelete(async (snap, context) => {
    const { id } = context.params;
    const data = snap.data() as Post.Response;

    const user = await db.doc(`profile/${data.updatedById}`).get();
    const userProfile = user.data() as Profile.Response;

    const activity: Activity.DeletePost = {
      action: 'deleted',
      before: data,
      after: null,
      category: 'posts',
      categoryId: id,
      createdById: data.updatedById,
      itemPath: `posts/${id}`,
      language: data.language,
      title: data.title,
      topics: data.topics,
      updatedAt: data.updatedAt,
      user: userProfile,
      userNotification:
        data.createdById === data.updatedById ? [] : [data.createdById],
    };

    return db.collection('activity').add(activity);
  });
