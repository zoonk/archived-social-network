import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Post } from '@zoonk/models';

export const onWritePostUpdateEditors = functions.firestore
  .document('posts/{id}')
  .onWrite(async (change) => {
    const data = change.after.data() as Post.Response | undefined;
    const hasEditor = data?.editors?.find(
      (editor) => data?.updatedById === editor,
    );

    if (!data || hasEditor) return false;

    return change.after.ref.update({
      editors: admin.firestore.FieldValue.arrayUnion(data.updatedById),
      [`editorsData.${data.updatedById}`]: data.updatedBy,
    });
  });
