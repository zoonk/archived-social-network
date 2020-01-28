import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateUsernameRemoveTheOldOne } from '../removeOldUsername';

test('remove all older usernames from the database', async (done) => {
  const usernames = [
    { id: '1', ref: '1' },
    { id: '2', ref: '2' },
    { id: '3', ref: '3' },
  ];

  spyOn(db.batch(), 'commit').and.returnValue('updated');
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: usernames,
  });

  const snap = { id: '2', data: () => ({ uid: 'userId' }) };
  const wrapped = testEnv.wrap(onCreateUsernameRemoveTheOldOne);
  const req = await wrapped(snap);

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('usernames');
  expect(db.collection('').where).toHaveBeenCalledWith('uid', '==', 'userId');
  expect(db.batch().delete).toHaveBeenCalledWith('1');
  expect(db.batch().delete).not.toHaveBeenCalledWith('2');
  expect(db.batch().delete).toHaveBeenCalledWith('3');
  done();
});
