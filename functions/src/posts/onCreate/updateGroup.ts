import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Group, Post } from '@zoonk/models';

const db = admin.firestore();

export const onCreatePostUpdateGroup = functions.firestore
  .document('posts/{id}')
  .onCreate(async (snap) => {
    const data = snap.data() as Post.Response;

    if (!data.groupId) {
      return false;
    }

    const group = await db.doc(`groups/${data.groupId}`).get();
    const { description, photo, title } = group.data() as Group.Response;
    const changes: Partial<Post.Response> = {
      groupData: { description, id: data.groupId, photo, title },
    };

    return snap.ref.update(changes);
  });
