import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateNotificationUpdateCount } from '../updateNotificationsCount';

beforeEach(() => {
  jest.clearAllMocks();
});

test('return when app notifications are disabled', async (done) => {
  const userData = { notificationSettings: { contentChanges: ['email'] } };
  const data = { type: 'contentChanges' };
  const snap = { data: () => data };

  spyOn(db, 'doc').and.returnValue({
    get: jest.fn().mockReturnValue({ data: () => userData }),
    update: jest.fn().mockReturnValue('updated'),
  });

  const context = { params: { userId: 'userId' } };
  const wrapped = testEnv.wrap(onCreateNotificationUpdateCount);
  const req = await wrapped(snap, context);

  expect(req).toBe(false);
  expect(db.doc).toHaveBeenCalledWith('users/userId');
  expect(db.doc('').get).toHaveBeenCalledTimes(1);
  expect(db.doc('').update).not.toHaveBeenCalled();
  done();
});

test('increment the number of notifications', async (done) => {
  const userData = { notificationSettings: { contentChanges: ['app'] } };
  const data = { type: 'contentChanges' };
  const snap = { data: () => data };

  spyOn(db, 'doc').and.returnValue({
    get: jest.fn().mockReturnValue({ data: () => userData }),
    update: jest.fn().mockReturnValue('updated'),
  });

  const context = { params: { userId: 'userId' } };
  const wrapped = testEnv.wrap(onCreateNotificationUpdateCount);
  const req = await wrapped(snap, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('users/userId');
  expect(db.doc('').get).toHaveBeenCalledTimes(1);
  expect(db.doc('').update).toHaveBeenCalledWith({ notifications: 1 });
  done();
});
