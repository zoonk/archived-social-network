import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostUpdateChapterCount } from '../updateChapterCount';

test('returns when chapters did not change', async (done) => {
  const data = {
    chapters: ['chapter1', 'chapter2'],
  };
  const change = {
    before: { data: () => data },
    after: { data: () => data },
  };

  const wrapped = testEnv.wrap(onWritePostUpdateChapterCount);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.batch().set).not.toHaveBeenCalled();
  expect(db.batch().commit).not.toHaveBeenCalled();
  done();
});

test('increase count for added chapters', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('chapters increased');
  when(db.doc as any)
    .calledWith('chapters/added2')
    .mockReturnValue('added2Ref');

  when(db.doc as any)
    .calledWith('chapters/added3')
    .mockReturnValue('added3Ref');

  const change = {
    before: { data: () => ({ chapters: ['chapter1'] }) },
    after: {
      data: () => ({
        category: 'examples',
        chapters: ['chapter1', 'added2', 'added3'],
      }),
    },
  };

  const expected = {
    examples: 1,
    lessons: 0,
    posts: 1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateChapterCount);
  const req = await wrapped(change);

  expect(req).toBe('chapters increased');
  expect(db.batch().set).toHaveBeenCalledWith('added2Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('added3Ref', expected, merge);
  done();
});

test('decrease count for removed chapters', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('chapters decreased');
  when(db.doc as any)
    .calledWith('chapters/removed1')
    .mockReturnValue('removed1Ref');

  when(db.doc as any)
    .calledWith('chapters/removed3')
    .mockReturnValue('removed3Ref');

  const change = {
    before: {
      data: () => ({
        category: 'lessons',
        chapters: ['removed1', 'chapter2', 'removed3'],
      }),
    },
    after: {
      data: () => ({
        chapters: ['chapter2'],
      }),
    },
  };

  const expected = {
    examples: 0,
    lessons: -1,
    posts: -1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateChapterCount);
  const req = await wrapped(change);

  expect(req).toBe('chapters decreased');
  expect(db.batch().set).toHaveBeenCalledWith('removed1Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('removed3Ref', expected, merge);
  done();
});

test('increase count when a post is created', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('post created');
  when(db.doc as any)
    .calledWith('chapters/created1')
    .mockReturnValue('created1Ref');

  when(db.doc as any)
    .calledWith('chapters/created2')
    .mockReturnValue('created2Ref');

  const change = {
    before: { data: () => undefined },
    after: {
      data: () => ({
        category: 'examples',
        chapters: ['created1', 'created2'],
      }),
    },
  };

  const expected = {
    examples: 1,
    lessons: 0,
    posts: 1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateChapterCount);
  const req = await wrapped(change);

  expect(req).toBe('post created');
  expect(db.batch().set).toHaveBeenCalledWith('created1Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('created2Ref', expected, merge);
  done();
});

test('decrease count when a post is deleted', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('post deleted');
  when(db.doc as any)
    .calledWith('chapters/deleted1')
    .mockReturnValue('deleted1Ref');

  when(db.doc as any)
    .calledWith('chapters/deleted2')
    .mockReturnValue('deleted2Ref');

  const change = {
    before: {
      data: () => ({ category: 'lessons', chapters: ['deleted1', 'deleted2'] }),
    },
    after: { data: () => undefined },
  };

  const expected = {
    examples: 0,
    lessons: -1,
    posts: -1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateChapterCount);
  const req = await wrapped(change);

  expect(req).toBe('post deleted');
  expect(db.batch().set).toHaveBeenCalledWith('deleted1Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('deleted2Ref', expected, merge);
  done();
});
