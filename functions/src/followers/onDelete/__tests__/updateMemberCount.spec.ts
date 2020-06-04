import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteFollowerUpdateMemberCount } from '../updateMemberCount';

test('increase the member count', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const params = { collection: 'topics', docId: 'topicId' };
  const wrapped = testEnv.wrap(onDeleteFollowerUpdateMemberCount);
  const req = await wrapped({}, { params });

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/topicId');
  expect(db.doc('').update).toHaveBeenCalledWith({ members: -1 });
  done();
});
