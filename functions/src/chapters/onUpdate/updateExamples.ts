import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { difference } from 'lodash';
import { Chapter, Post } from '@zoonk/models';

const db = admin.firestore();

export const onUpdateChapterUpdateExamples = functions.firestore
  .document('chapters/{id}')
  .onUpdate(async (changes) => {
    const batch = db.batch();
    const before = changes.before.data() as Chapter.Response;
    const after = changes.after.data() as Chapter.Response;
    const removed = difference(before.examples, after.examples);
    const added = difference(after.examples, before.examples);
    const noChanges = removed.length === 0 && added.length === 0;

    if (noChanges) {
      return false;
    }

    // Remove data from removed examples.
    removed.forEach((example) => {
      batch.update(changes.after.ref, {
        [`exampleData.${example}`]: admin.firestore.FieldValue.delete(),
      });
    });

    // Get data for every example added to this chapter.
    const promises = added.map((item) => db.doc(`posts/${item}`).get());
    const examples = await Promise.all(promises);
    examples.forEach((example) => {
      const data = example.data() as Post.Response;
      const summary: Post.Summary = {
        id: example.id,
        description: data.content,
        title: data.title,
      };
      batch.update(changes.after.ref, {
        [`exampleData.${example.id}`]: summary,
      });
    });

    return batch.commit();
  });
