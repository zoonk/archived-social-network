import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateLeaderboardUpdateFollowerXP } from '../updateFollowerXp';

test('update XP for existing topic followers', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue(Promise.resolve());

  const params = { id: 'topicId', userId: 'user' };
  const data = { xp: 2 };
  const change = { after: { data: () => data } };
  const wrapped = testEnv.wrap(onUpdateLeaderboardUpdateFollowerXP);
  const req = await wrapped(change, { params });

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('topics/topicId/followers/user');
  expect(db.doc('').update).toHaveBeenCalledWith({ xp: 2 });
  done();
});

test('do not update when the user is not following this topic', async (done) => {
  // eslint-disable-next-line prefer-promise-reject-errors
  spyOn(db.doc(''), 'update').and.returnValue(Promise.reject({ code: 5 }));

  const params = { id: 'topicId', userId: 'user' };
  const data = { xp: 2 };
  const change = { after: { data: () => data } };
  const wrapped = testEnv.wrap(onUpdateLeaderboardUpdateFollowerXP);
  const req = await wrapped(change, { params });

  expect(req).toBe(5);
  expect(db.doc).toHaveBeenCalledWith('topics/topicId/followers/user');
  expect(db.doc('').update).toHaveBeenCalledWith({ xp: 2 });
  done();
});
