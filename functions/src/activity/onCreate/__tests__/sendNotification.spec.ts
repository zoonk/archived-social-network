import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onCreateActivitySendNotification } from '../sendNotification';

test('return when an activity should not notify any users', async (done) => {
  const snap = { data: () => ({ userNotification: [] }) };
  const context = { params: { id: 'activityId' } };
  const wrapped = testEnv.wrap(onCreateActivitySendNotification);
  const req = await wrapped(snap, context);

  expect(req).toBe(false);
  expect(db.batch().create).not.toHaveBeenCalled();
  expect(db.batch().commit).not.toHaveBeenCalled();
  done();
});

test('send a notification to all required users', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('sent');

  when(db.collection as any)
    .calledWith('users/user1/notifications')
    .mockReturnValue({
      doc: jest.fn().mockReturnValue('user1Ref'),
    });

  when(db.collection as any)
    .calledWith('users/user2/notifications')
    .mockReturnValue({
      doc: jest.fn().mockReturnValue('user2Ref'),
    });

  const data = {
    action: 'updated',
    category: 'posts',
    itemPath: 'posts/itemId',
    language: 'en',
    title: 'title',
    updatedAt: 'timestamp',
    user: { name: 'user name' },
  };
  const snapData = {
    ...data,
    userNotification: ['user1', 'user2'],
  };
  const expected = {
    ...data,
    activityId: 'activityId',
    type: 'contentChanges',
  };
  const snap = { data: () => snapData };
  const context = { params: { id: 'activityId' } };
  const wrapped = testEnv.wrap(onCreateActivitySendNotification);
  const req = await wrapped(snap, context);

  expect(req).toBe('sent');
  expect(db.batch().create).toHaveBeenCalledWith('user1Ref', expected);
  expect(db.batch().create).toHaveBeenCalledWith('user2Ref', expected);
  done();
});
