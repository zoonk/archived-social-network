import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post } from '@zoonk/models';
import { getPlainText } from '../../helpers';

const db = admin.firestore();

export const onWritePostUpdateGroups = functions.firestore
  .document('posts/{id}')
  .onWrite((change, context) => {
    const { id } = context.params;
    const before = change.before.data() as Post.Response | undefined;
    const after = change.after.data() as Post.Response | undefined;
    const isEqual = Boolean(before?.pinned) === Boolean(after?.pinned);
    const removed = before?.pinned && !after?.pinned;
    const added = !before?.pinned && after?.pinned;
    const groupId = after?.groupId || before?.groupId;

    if (isEqual || !groupId) return false;

    if (removed) {
      return db.doc(`groups/${groupId}`).update({
        pinned: admin.firestore.FieldValue.arrayRemove(id),
        [`pinnedPosts.${id}`]: admin.firestore.FieldValue.delete(),
      });
    }

    if (added && after) {
      const post: Post.Summary = {
        cover: after.cover,
        description: getPlainText(JSON.parse(after.content)),
        id,
        title: after.title,
      };

      return db.doc(`groups/${groupId}`).update({
        pinned: admin.firestore.FieldValue.arrayUnion(id),
        [`pinnedPosts.${id}`]: post,
      });
    }

    return false;
  });
