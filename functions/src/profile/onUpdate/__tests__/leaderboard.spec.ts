import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateProfileUpdateLeaderboard } from '../leaderboard';

const data = {
  bio: 'artist',
  name: 'Leo',
  photo: 'davinci.jpg',
};

const change = {
  before: { data: () => ({}) },
  after: { data: () => data },
};

test('return when the data did not change', async (done) => {
  const noChange = {
    before: {
      data: () => ({ bio: 'artist', name: 'Leo', photo: 'davinci.jpg' }),
    },
    after: {
      data: () => ({ bio: 'artist', name: 'Leo', photo: 'davinci.jpg' }),
    },
  };

  const wrapped = testEnv.wrap(onUpdateProfileUpdateLeaderboard);
  const req = await wrapped(noChange, { params: { uid: 'testUID' } });

  expect(req).toBe(false);
  done();
});

test('update the profile for every doc', async (done) => {
  spyOn(Promise, 'all');
  spyOn(db.collectionGroup('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { ref: { update: jest.fn().mockReturnValue('doc1') } },
      { ref: { update: jest.fn().mockReturnValue('doc2') } },
    ],
  });

  const wrapped = testEnv.wrap(onUpdateProfileUpdateLeaderboard);
  const req = await wrapped(change, { params: { uid: 'testUID' } });

  const spy1 = (
    await db
      .collectionGroup('')
      .where('', '==', '')
      .get()
  ).docs[0].ref.update;
  const spy2 = (
    await db
      .collectionGroup('')
      .where('', '==', '')
      .get()
  ).docs[1].ref.update;

  expect(req).toBe(true);
  expect(db.collectionGroup).toHaveBeenCalledWith('leaderboard');
  expect(spy1).toHaveBeenCalledWith(data);
  expect(spy2).toHaveBeenCalledWith(data);
  expect(Promise.all).toHaveBeenCalledWith(['doc1', 'doc2']);
  done();
});
