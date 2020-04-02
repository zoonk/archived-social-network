import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostProgressEarnXp } from '../earnXpForPosts';

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue(true);
});

test('return if the read status is still true', async (done) => {
  const change = {
    before: { data: () => ({ read: true }) },
    after: { data: () => ({ read: true }) },
  };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return if the read status is still false', async (done) => {
  const change = {
    before: { data: () => ({ read: false }) },
    after: { data: () => ({ read: false }) },
  };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when before is undefined and after is false', async (done) => {
  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ read: false }) },
  };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when after is undefined and before is false', async (done) => {
  const change = {
    before: { data: () => ({ read: false }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
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
    after: { data: () => ({ read: true }) },
  };
  const context = {
    params: {
      postId: 'postId',
      userId: 'editorId',
    },
  };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change, context);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalledWith('leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic1/leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic2/leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic3/leaderboard/editorId');
  done();
});

test('increase XP when a post is read', async (done) => {
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
    after: { data: () => ({ read: true }) },
  };
  const context = { params: { postId: 'postId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: 1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});

test('decrease XP when a post is unread', async (done) => {
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
    before: { data: () => ({ read: true }) },
    after: { data: () => undefined },
  };
  const context = { params: { postId: 'postId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: -1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});
