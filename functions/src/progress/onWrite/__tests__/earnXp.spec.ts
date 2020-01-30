import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostProgressUpdateXP } from '../earnXp';

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue(true);
});

test('return if the data did not change', async (done) => {
  const change = {
    before: { data: () => ({ completed: false }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateXP);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when users complete their own content', async (done) => {
  when(db.doc as any)
    .calledWith('posts/postId')
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
    after: { data: () => ({ completed: true }) },
  };
  const context = {
    params: {
      postId: 'postId',
      userId: 'editorId',
    },
  };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalledWith('leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic1/leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic2/leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic3/leaderboard/editorId');
  done();
});

test('increase XP when a post is completed', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ completed: true }) },
  };
  const context = { params: { postId: 'postId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: 1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWritePostProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});

test('decrease the XP when a completed field becomes falsy', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => ({ completed: true }) },
    after: { data: () => undefined },
  };
  const context = { params: { postId: 'postId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: -1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWritePostProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});
