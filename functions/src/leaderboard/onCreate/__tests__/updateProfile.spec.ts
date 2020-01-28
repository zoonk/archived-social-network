import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateLeaderboardUpdateProfile } from '../updateProfile';

test('update the user profile when a leaderboard is created', async (done) => {
  const data = { name: 'test user' };

  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => data,
  });

  const snap = {
    id: 'testUID',
    ref: { update: jest.fn().mockReturnValue('updated') },
  };
  const wrapped = testEnv.wrap(onCreateLeaderboardUpdateProfile);
  const req = await wrapped(snap);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('profile/testUID');
  expect(snap.ref.update).toHaveBeenCalledWith(data);
  done();
});
