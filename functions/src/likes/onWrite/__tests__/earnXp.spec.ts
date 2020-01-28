import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWriteCategoryLikeUpdateXP } from '../earnXp';

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue(true);
});

test('return if the data did not change', async (done) => {
  const change = {
    before: { data: () => ({ like: false }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when users like their own content', async (done) => {
  when(db.doc as any)
    .calledWith('topics/topicId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          category: 'topics',
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'editorId',
        }),
      }),
    });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ like: true }) },
  };
  const context = {
    params: {
      category: 'topics',
      categoryId: 'topicId',
      createdById: 'editorId',
    },
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalledWith('leaderboard/editorId');
  done();
});

test('update the XP for the /leaderboard collection', async (done) => {
  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');
  when(db.doc as any)
    .calledWith('topics/topicId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'editorId',
        }),
      }),
    });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ like: true }) },
  };
  const context = { params: { category: 'topics', categoryId: 'topicId' } };
  const expected = {
    createdById: 'editorId',
    xp: 10,
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(db.batch().set).toHaveBeenCalledWith('leaderboardRef', expected, {
    merge: true,
  });
  done();
});

test('decrease the XP when a like is removed', async (done) => {
  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');
  when(db.doc as any)
    .calledWith('topics/topicId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'editorId',
        }),
      }),
    });

  const change = {
    before: { data: () => ({ like: true }) },
    after: { data: () => undefined },
  };
  const context = { params: { category: 'topics', categoryId: 'topicId' } };
  const expected = {
    createdById: 'editorId',
    xp: -10,
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(db.batch().set).toHaveBeenCalledWith('leaderboardRef', expected, {
    merge: true,
  });
  done();
});

test('update the XP for all topics', async (done) => {
  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('topics/topicId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          category: 'references',
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'editorId',
        }),
      }),
    });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ like: true }) },
  };
  const context = { params: { category: 'topics', categoryId: 'topicId' } };
  const expected = {
    createdById: 'editorId',
    xp: 10,
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(db.batch().set).toHaveBeenCalledWith('topic1Ref', expected, {
    merge: true,
  });
  expect(db.batch().set).toHaveBeenCalledWith('topic2Ref', expected, {
    merge: true,
  });
  expect(db.batch().set).toHaveBeenCalledWith('topic3Ref', expected, {
    merge: true,
  });
  done();
});
