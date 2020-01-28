import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateNotificationUpdateCount } from '../updateNotificationsCount';

test('increment the number of notifications', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const context = { params: { createdById: 'createdById' } };
  const wrapped = testEnv.wrap(onCreateNotificationUpdateCount);
  const req = await wrapped({}, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('users/createdById');
  expect(db.doc('').update).toHaveBeenCalledWith({ notifications: 1 });
  done();
});
