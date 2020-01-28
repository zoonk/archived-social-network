import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateProfileUpdateSettings } from '../settings';

const data = {
  bio: 'artist',
  name: 'Leo',
  photo: 'davinci.jpg',
};

const change = {
  before: { data: () => ({}) },
  after: { data: () => data },
};

test('return when the data did not change', async (done) => {
  const noChange = {
    before: {
      data: () => ({ bio: 'artist', name: 'Leo', photo: 'davinci.jpg' }),
    },
    after: {
      data: () => ({ bio: 'artist', name: 'Leo', photo: 'davinci.jpg' }),
    },
  };

  const wrapped = testEnv.wrap(onUpdateProfileUpdateSettings);
  const req = await wrapped(noChange, { params: { uid: 'testUID' } });

  expect(req).toBe(false);
  done();
});

test('update the public profile when user settings change', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('settings');

  const wrapped = testEnv.wrap(onUpdateProfileUpdateSettings);
  const req = await wrapped(change, { params: { uid: 'testUID' } });

  expect(db.doc).toHaveBeenCalledWith('users/testUID');
  expect(db.doc('').update).toHaveBeenCalledWith(data);
  expect(req).toBe('settings');
  done();
});
