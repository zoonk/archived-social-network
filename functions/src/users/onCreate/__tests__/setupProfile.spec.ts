import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();

import { onCreateUserSetupProfile } from '../setupProfile';

const db = admin.firestore();

beforeAll(() => {
  when(db.doc as any)
    .calledWith('users/testUID')
    .mockReturnValue({ path: 'users/testUID' })
    .calledWith('profile/testUID')
    .mockReturnValue({ path: 'profile/testUID' });
});

test('add the user info to their settings', async (done) => {
  const spy = spyOn(db.batch(), 'set');
  const ref = db.doc('users/testUID');

  const wrapped = testEnv.wrap(onCreateUserSetupProfile);
  await wrapped({ email: 'test@test.com', uid: 'testUID' });

  const userInfo = {
    bio: null,
    email: 'test@test.com',
    name: 'test',
    notifications: 0,
    notificationSettings: {
      comments: ['app', 'email'],
      contentChanges: ['app', 'email'],
    },
    photo: null,
    role: 'viewer',
    username: 'testUID',
  };

  expect(spy).toHaveBeenCalledWith(ref, userInfo, { merge: true });
  done();
});

test('add the user info to their profile', async (done) => {
  const spy = spyOn(db.batch(), 'set');
  const ref = db.doc('profile/testUID');

  const wrapped = testEnv.wrap(onCreateUserSetupProfile);
  await wrapped({
    displayName: 'user name',
    email: 'test@test.com',
    photoURL: 'photo.png',
    uid: 'testUID',
  });

  const userInfo = {
    bio: null,
    name: 'user name',
    photo: 'photo.png',
    username: 'testUID',
  };

  expect(spy).toHaveBeenCalledWith(ref, userInfo, { merge: true });
  done();
});

test('add the user info to the leaderboard', async (done) => {
  const spy = spyOn(db.batch(), 'set');
  const ref = db.doc('leaderboard/testUID');

  const wrapped = testEnv.wrap(onCreateUserSetupProfile);
  await wrapped({ email: 'test@test.com', uid: 'testUID' });

  const userInfo = {
    bio: null,
    createdById: 'testUID',
    name: 'test',
    photo: null,
    username: 'testUID',
    xp: 1,
  };

  expect(spy).toHaveBeenCalledWith(ref, userInfo, { merge: true });
  done();
});

test('commit all changes to the database', async (done) => {
  const setSpy = spyOn(db.batch(), 'set');
  spyOn(db.batch(), 'commit').and.returnValue(true);

  const wrapped = testEnv.wrap(onCreateUserSetupProfile);
  const req = await wrapped({ email: 'test@test.com', uid: 'testUID' });

  expect(setSpy).toHaveBeenCalledTimes(3);
  expect(req).toBe(true);
  done();
});
