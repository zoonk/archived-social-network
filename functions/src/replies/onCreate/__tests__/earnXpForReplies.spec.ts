import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onCreateReplyEarnXP } from '../earnXpForReplies';

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue(true);
});

test('update the XP for the /leaderboard collection', async (done) => {
  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  const snap = {
    data: () => ({
      topics: ['topic1', 'topic2', 'topic3'],
      createdById: 'editorId',
    }),
  };
  const expected = {
    createdById: 'editorId',
    xp: 1,
  };
  const wrapped = testEnv.wrap(onCreateReplyEarnXP);
  const req = await wrapped(snap);

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

  const snap = {
    data: () => ({
      category: 'comments',
      topics: ['topic1', 'topic2', 'topic3'],
      createdById: 'editorId',
    }),
  };
  const expected = {
    createdById: 'editorId',
    xp: 1,
  };
  const wrapped = testEnv.wrap(onCreateReplyEarnXP);
  const req = await wrapped(snap);

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
