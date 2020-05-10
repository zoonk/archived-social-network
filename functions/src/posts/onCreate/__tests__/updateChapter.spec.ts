import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreatePostUpdateChapter } from '../updateChapter';

test('return when there is no chapterId', async (done) => {
  const data = { chapterId: null };
  const snap = { data: () => data, ref: { update: jest.fn() } };
  const wrapped = testEnv.wrap(onCreatePostUpdateChapter);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(snap.ref.update).not.toHaveBeenCalled();
  done();
});

test("update a chapter's data", async (done) => {
  const data = { chapterId: 'chapterId' };
  const chapterData = { title: 'title', description: 'description' };
  const snap = { data: () => data, ref: { update: jest.fn() } };

  spyOn(snap.ref, 'update').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({ data: () => chapterData });

  const wrapped = testEnv.wrap(onCreatePostUpdateChapter);
  const req = await wrapped(snap);
  const changes = {
    chapterData: { ...chapterData, id: 'chapterId' },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(snap.ref.update).toHaveBeenCalledWith(changes);
  done();
});
