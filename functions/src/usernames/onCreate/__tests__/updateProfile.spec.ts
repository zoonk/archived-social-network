import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateUsernameUpdateProfile } from '../updateProfile';

test('update the username field in the profile collection', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const snap = { id: 'username', data: () => ({ uid: 'userId' }) };
  const wrapped = testEnv.wrap(onCreateUsernameUpdateProfile);
  const req = await wrapped(snap);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('profile/userId');
  expect(db.doc('').update).toHaveBeenCalledWith({ username: 'username' });
  done();
});
