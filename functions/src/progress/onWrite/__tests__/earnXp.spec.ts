import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();
const batch = db.batch();
const merge = true;

import { onWritePostProgressEarnXp } from '../earnXp';

const postData = {
  createdById: 'authorId',
  groupId: 'groupId',
  topics: ['1', '2'],
};

beforeEach(() => {
  jest.clearAllMocks();
  spyOn(batch, 'commit').and.returnValue(true);
  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({ get: () => ({ data: () => postData }) });
  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({ get: () => ({ data: () => postData }) });
  when(db.doc as any)
    .calledWith('leaderboard/userId')
    .mockReturnValue('userRef');
  when(db.doc as any)
    .calledWith('topics/1/leaderboard/userId')
    .mockReturnValue('topic1Ref');
  when(db.doc as any)
    .calledWith('topics/2/leaderboard/userId')
    .mockReturnValue('topic2Ref');
  when(db.doc as any)
    .calledWith('groups/groupId/followers/userId')
    .mockReturnValue('groupRef');
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
  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ read: true }) },
  };
  const params = { postId: 'postId', userId: 'authorId' };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change, { params });

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalledWith('leaderboard/authorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic1/leaderboard/authorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic2/leaderboard/authorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic3/leaderboard/authorId');
  done();
});

test('increase XP when a post is read', async (done) => {
  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ read: true }) },
  };
  const params = { postId: 'postId', userId: 'userId' };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change, { params });
  const payload = { createdById: 'userId', xp: 1 };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(5);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp: 1 }, { merge });
  done();
});

test('decrease XP when a post is unread', async (done) => {
  const change = {
    before: { data: () => ({ read: true }) },
    after: { data: () => undefined },
  };
  const params = { postId: 'postId', userId: 'userId' };
  const wrapped = testEnv.wrap(onWritePostProgressEarnXp);
  const req = await wrapped(change, { params });
  const payload = { createdById: 'userId', xp: -1 };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(5);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp: -1 }, { merge });
  done();
});
