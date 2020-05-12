import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteFollowerUpdateMyGroups } from '../updateMyGroups';

test('delete from user groups', async (done) => {
  spyOn(db.doc(''), 'delete').and.returnValue('deleted');

  const params = { id: 'groupId', userId: 'userId' };
  const wrapped = testEnv.wrap(onDeleteFollowerUpdateMyGroups);
  const req = await wrapped({}, { params });

  expect(req).toBe('deleted');
  expect(db.doc).toHaveBeenCalledWith('users/userId/groups/groupId');
  expect(db.doc('').delete).toHaveBeenCalledTimes(1);
  done();
});
