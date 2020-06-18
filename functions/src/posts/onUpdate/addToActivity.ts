import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Activity, Post } from '@zoonk/models';

const db = admin.firestore();

export const onUpdatePostAddToActivity = functions.firestore
  .document('posts/{id}')
  .onUpdate(async (change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Post.Response;
    const after = change.after.data() as Post.Response;
    const fieldsToTrack = ['content', 'links', 'subtitle', 'title', 'topics'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const activity: Activity.UpdatePost = {
      action: 'updated',
      after,
      before,
      category: 'posts',
      categoryId: id,
      createdById: after.updatedById,
      itemPath: `posts/${id}`,
      language: after.language,
      title: after.title,
      topics: after.topics,
      updatedAt: after.updatedAt,
      user: after.updatedBy,
      userNotification:
        after.createdById === after.updatedById ? [] : [after.createdById],
    };

    return db.collection('activity').add(activity);
  });
