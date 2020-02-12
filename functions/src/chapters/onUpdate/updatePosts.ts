import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { Chapter, ContentSummary } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateChapterUpdatePosts = functions.firestore
  .document('chapters/{id}')
  .onUpdate(async (changes) => {
    const { id } = changes.after;
    const before = changes.before.data() as Chapter.Response;
    const after = changes.after.data() as Chapter.Response;
    const fieldsToTrack = ['description', 'photo', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const chapter: Partial<ContentSummary> = {
      description: after.description,
      photo: after.photo,
      title: after.title,
    };

    const promises: any[] = [];
    const posts = await db
      .collection('posts')
      .where('chapterId', '==', id)
      .get();

    posts.docs.forEach((post) => {
      promises.push(post.ref.update({ chapter }));
    });

    return Promise.all(promises);
  });
