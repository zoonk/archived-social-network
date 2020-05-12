import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();
const batch = db.batch();
const merge = true;

import { onCreateActivityEarnXP } from '../earnXp';
import { xpActions } from '../../../settings';

beforeEach(() => {
  jest.clearAllMocks();
  spyOn(batch, 'commit').and.returnValue(true);
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

test('increase XP when a chapter is created', async (done) => {
  const data = {
    action: 'created',
    category: 'chapters',
    createdById: 'userId',
    topics: ['1'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.created_chapters };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(2);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  done();
});

test('increase XP when a chapter is edited', async (done) => {
  const data = {
    action: 'updated',
    category: 'chapters',
    createdById: 'userId',
    topics: ['1'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.updated_chapters };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(2);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  done();
});

test('increase XP when a chapter is deleted', async (done) => {
  const data = {
    action: 'deleted',
    category: 'chapters',
    createdById: 'userId',
    topics: ['1'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.deleted_chapters };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(2);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  done();
});

test('decrease XP when a chapter is deleted by the author', async (done) => {
  const data = {
    action: 'deleted',
    before: { createdById: 'userId' },
    category: 'chapters',
    createdById: 'userId',
    topics: ['1'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: -xpActions.created_chapters };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(2);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  done();
});

test('increase XP when a group is created', async (done) => {
  const data = {
    action: 'created',
    category: 'groups',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.created_groups };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});

test('increase XP when a group is edited', async (done) => {
  const data = {
    action: 'updated',
    category: 'groups',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.updated_groups };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});

test('increase XP when a group is deleted', async (done) => {
  const data = {
    action: 'deleted',
    category: 'groups',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.deleted_groups };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});

test('decrease XP when a group is deleted by the author', async (done) => {
  const data = {
    action: 'deleted',
    before: { createdById: 'userId' },
    category: 'chapters',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: -xpActions.created_groups };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});

test('increase XP when a post is created', async (done) => {
  const data = {
    action: 'created',
    after: { groupId: 'groupId' },
    category: 'posts',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const xp = xpActions.created_posts;
  const payload = { createdById: 'userId', xp };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(4);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp }, { merge });
  done();
});

test('increase XP when a post is edited', async (done) => {
  const data = {
    action: 'updated',
    after: { groupId: 'groupId' },
    category: 'posts',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const xp = xpActions.updated_posts;
  const payload = { createdById: 'userId', xp };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(4);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp }, { merge });
  done();
});

test('increase XP when a post is deleted', async (done) => {
  const data = {
    action: 'deleted',
    before: { groupId: 'groupId' },
    after: null,
    category: 'posts',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const xp = xpActions.deleted_posts;
  const payload = { createdById: 'userId', xp };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(4);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp }, { merge });
  done();
});

test('decrease XP when a post is deleted by the author', async (done) => {
  const data = {
    action: 'deleted',
    before: { createdById: 'userId', groupId: 'groupId' },
    after: null,
    category: 'posts',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const xp = -xpActions.created_posts;
  const payload = { createdById: 'userId', xp };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(4);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp }, { merge });
  done();
});

test('increase XP when a topic is created', async (done) => {
  const data = {
    action: 'created',
    category: 'topics',
    createdById: 'userId',
    topics: ['1'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.created_topics };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(2);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  done();
});

test('increase XP when a topic is edited', async (done) => {
  const data = {
    action: 'updated',
    category: 'topics',
    createdById: 'userId',
    topics: ['1'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: xpActions.updated_topics };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(2);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  done();
});

test('increase XP for an unknown created action', async (done) => {
  const data = {
    action: 'created',
    category: 'unknown',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: 1 };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});

test('increase XP for an unknown updated action', async (done) => {
  const data = {
    action: 'updated',
    category: 'unknown',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: 1 };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});

test('increase XP for an unknown deleted action', async (done) => {
  const data = {
    action: 'deleted',
    category: 'unknown',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: 1 };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});

test('decrease XP for an unknown deleted action by the author', async (done) => {
  const data = {
    action: 'deleted',
    before: { createdById: 'userId' },
    category: 'unknown',
    createdById: 'userId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityEarnXP);
  const req = await wrapped(snap);
  const payload = { createdById: 'userId', xp: -1 };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledTimes(3);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  done();
});
