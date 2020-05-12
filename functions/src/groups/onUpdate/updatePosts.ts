import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Group, Post } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateGroupUpdatePosts = functions.firestore
  .document('groups/{id}')
  .onUpdate(async (change) => {
    const { id } = change.after;
    const before = change.before.data() as Group.Response;
    const after = change.after.data() as Group.Response;
    const fieldsToTrack = ['description', 'photo', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) return false;

    const groupData: Group.Summary = {
      description: after.description,
      id,
      photo: after.photo,
      title: after.title,
    };
    const payload: Partial<Post.Response> = { groupData };
    const posts = await db
      .collection('posts')
      .where('groupId', '==', id)
      .get();

    const updates = posts.docs.map((post) => post.ref.update(payload));
    return Promise.all(updates);
  });
