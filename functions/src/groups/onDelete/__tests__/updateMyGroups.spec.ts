import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteGroupUpdateMyGroups } from '../updateMyGroups';

test('delete user groups', async (done) => {
  const docs = [{ id: 'user1' }, { id: 'user2' }];
  spyOn(Promise, 'all').and.returnValue('updated');
  spyOn(db.collection(''), 'get').and.returnValue({ docs });
  spyOn(db.doc(''), 'delete').and.returnValue('ref');

  const snap = { id: 'itemId' };
  const wrapped = testEnv.wrap(onDeleteGroupUpdateMyGroups);
  const req = await wrapped(snap);

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('groups/itemId/followers');
  expect(db.doc).toHaveBeenCalledWith('users/user1/groups/itemId');
  expect(db.doc).toHaveBeenCalledWith('users/user2/groups/itemId');
  expect(db.doc('').delete).toHaveBeenCalledTimes(2);
  expect(Promise.all).toHaveBeenCalledWith(['ref', 'ref']);
  done();
});
