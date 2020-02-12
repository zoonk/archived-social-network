import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isEqual, pick } from 'lodash';
import { ContentSummary, Path } from '@zoonk/models';

const db = admin.firestore();

export const onUpdatePathUpdateChapters = functions.firestore
  .document('paths/{id}')
  .onUpdate(async (changes) => {
    const { id } = changes.after;
    const before = changes.before.data() as Path.Response;
    const after = changes.after.data() as Path.Response;
    const fieldsToTrack = ['description', 'photo', 'title'];
    const beforeChanges = pick(before, fieldsToTrack);
    const afterChanges = pick(after, fieldsToTrack);
    const noChanges = isEqual(beforeChanges, afterChanges);

    if (noChanges) {
      return false;
    }

    const path: Partial<ContentSummary> = {
      description: after.description,
      photo: after.photo,
      title: after.title,
    };

    const promises: any[] = [];
    const chapters = await db
      .collection('chapters')
      .where('pathId', '==', id)
      .get();

    chapters.docs.forEach((chapter) => {
      promises.push(chapter.ref.update({ path }));
    });

    return Promise.all(promises);
  });
