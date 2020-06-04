import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateFollowerUpdateCount } from '../updateCount';

test('increase the member count', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const params = { collection: 'groups', docId: 'groupId' };
  const wrapped = testEnv.wrap(onCreateFollowerUpdateCount);
  const req = await wrapped({}, { params });

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId');
  expect(db.doc('').update).toHaveBeenCalledWith({ followers: 1 });
  done();
});
