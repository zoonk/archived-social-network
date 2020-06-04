import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteFollowerUpdateFollowing } from '../updateFollowing';

test('delete from the following list', async (done) => {
  spyOn(db.doc(''), 'delete').and.returnValue('deleted');

  const params = { collection: 'topics', docId: 'topicId', userId: 'userId' };
  const wrapped = testEnv.wrap(onDeleteFollowerUpdateFollowing);
  const req = await wrapped({}, { params });

  expect(req).toBe('deleted');
  expect(db.doc).toHaveBeenCalledWith('users/userId/topics/topicId');
  expect(db.doc('').delete).toHaveBeenCalledTimes(1);
  done();
});
