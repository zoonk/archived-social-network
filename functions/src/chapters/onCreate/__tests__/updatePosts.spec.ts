import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();
const batch = db.batch();

import { onCreateChapterUpdatePosts } from '../updatePosts';

test('return when there are no posts', async (done) => {
  const data = { examples: [], lessons: [] };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateChapterUpdatePosts);
  const req = await wrapped(snap);
  expect(req).toBe(false);
  expect(batch.update).not.toHaveBeenCalled();
  expect(batch.commit).not.toHaveBeenCalled();
  done();
});

test('update all posts', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('updated');
  when(db.doc as any)
    .calledWith('posts/ex1')
    .mockReturnValue('ex1Ref')
    .calledWith('posts/ex2')
    .mockReturnValue('ex2Ref')
    .calledWith('posts/les1')
    .mockReturnValue('les1Ref')
    .calledWith('posts/les2')
    .mockReturnValue('les2Ref');

  const data = { description: 'description', title: 'title' };
  const snap = {
    id: 'chapterId',
    data: () => ({
      ...data,
      examples: ['ex1', 'ex2'],
      lessons: ['les1', 'les2'],
    }),
  };
  const wrapped = testEnv.wrap(onCreateChapterUpdatePosts);
  const req = await wrapped(snap);
  const payload = {
    chapterId: 'chapterId',
    chapterData: {
      ...data,
      examples: 2,
      id: 'chapterId',
      lessons: 2,
      posts: 4,
    },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('posts/ex1');
  expect(db.doc).toHaveBeenCalledWith('posts/ex2');
  expect(db.doc).toHaveBeenCalledWith('posts/les1');
  expect(db.doc).toHaveBeenCalledWith('posts/les2');
  expect(batch.update).toHaveBeenCalledWith('ex1Ref', payload);
  expect(batch.update).toHaveBeenCalledWith('ex2Ref', payload);
  expect(batch.update).toHaveBeenCalledWith('les1Ref', payload);
  expect(batch.update).toHaveBeenCalledWith('les2Ref', payload);
  expect(batch.commit).toHaveBeenCalled();
  done();
});
