import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteFollowerUpdateMemberCount } from '../updateMemberCount';

test('increase the member count', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const params = { groupId: 'groupId' };
  const wrapped = testEnv.wrap(onDeleteFollowerUpdateMemberCount);
  const req = await wrapped({}, { params });

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId');
  expect(db.doc('').update).toHaveBeenCalledWith({ members: -1 });
  done();
});
