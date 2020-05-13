import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateFollowerSetupUser } from '../setupUser';

test('setup a group follower data', async (done) => {
  const snap = { id: 'userId', ref: { update: jest.fn() } };
  const profile = { name: 'leo', username: 'davinci' };

  spyOn(snap.ref, 'update').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({ data: () => profile });

  const wrapped = testEnv.wrap(onCreateFollowerSetupUser);
  const req = await wrapped(snap);
  const payload = { ...profile, joined: 'timestamp', xp: 1 };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('profile/userId');
  expect(snap.ref.update).toHaveBeenCalledWith(payload);
  done();
});
