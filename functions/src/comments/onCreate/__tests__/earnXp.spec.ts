import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();
const batch = db.batch();
const merge = true;

import { onCreateCommentEarnXP } from '../earnXp';
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

test('increase XP when a comment is created', async (done) => {
  const data = {
    createdById: 'userId',
    groupId: 'groupId',
    topics: ['1', '2'],
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateCommentEarnXP);
  const req = await wrapped(snap);
  const xp = xpActions.created_comments;
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
