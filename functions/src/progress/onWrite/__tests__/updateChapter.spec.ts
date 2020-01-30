import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostProgressUpdateChapter } from '../updateChapter';

test('return if the data did not change', async (done) => {
  const change = {
    before: { data: () => ({ completed: false }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateChapter);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('increment the completed counter', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('updated');
  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          category: 'lessons',
          chapters: ['chapter1', 'chapter2'],
        }),
      }),
    });

  when(db.doc as any)
    .calledWith('chapters/chapter1/progress/userId')
    .mockReturnValue('chapter1Ref');

  when(db.doc as any)
    .calledWith('chapters/chapter2/progress/userId')
    .mockReturnValue('chapter2Ref');

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ completed: true }) },
  };
  const context = { params: { postId: 'postId', userId: 'userId' } };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateChapter);
  const req = await wrapped(change, context);
  const expected = {
    examples: 0,
    lessons: 1,
    posts: 1,
  };

  expect(req).toBe('updated');
  expect(db.batch().set).toHaveBeenCalledWith('chapter1Ref', expected, {
    merge: true,
  });
  expect(db.batch().set).toHaveBeenCalledWith('chapter2Ref', expected, {
    merge: true,
  });
  done();
});

test('decrement the completed counter', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('updated');

  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          category: 'examples',
          chapters: ['chapter3', 'chapter4'],
        }),
      }),
    });

  when(db.doc as any)
    .calledWith('chapters/chapter3/progress/userId')
    .mockReturnValue('chapter3Ref');

  when(db.doc as any)
    .calledWith('chapters/chapter4/progress/userId')
    .mockReturnValue('chapter4Ref');

  const change = {
    before: { data: () => ({ completed: true }) },
    after: { data: () => undefined },
  };
  const context = { params: { postId: 'postId', userId: 'userId' } };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateChapter);
  const req = await wrapped(change, context);
  const expected = {
    examples: -1,
    lessons: 0,
    posts: -1,
  };

  expect(req).toBe('updated');
  expect(db.batch().set).toHaveBeenCalledWith('chapter3Ref', expected, {
    merge: true,
  });
  expect(db.batch().set).toHaveBeenCalledWith('chapter4Ref', expected, {
    merge: true,
  });
  done();
});
