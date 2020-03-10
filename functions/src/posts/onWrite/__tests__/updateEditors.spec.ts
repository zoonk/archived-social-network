import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostUpdateEditors } from '../updateEditors';

test('return when the post is deleted', async (done) => {
  const change = { after: { data: () => undefined } };
  const wrapped = testEnv.wrap(onWritePostUpdateEditors);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when the editor is already in the list', async (done) => {
  const change = {
    after: {
      data: () => ({
        editors: ['user1', 'user2', 'user3'],
        updatedById: 'user2',
      }),
    },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateEditors);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('update the editors list', async (done) => {
  const profile = { name: 'name', photo: 'photo.png' };

  spyOn(admin.firestore.FieldValue, 'arrayUnion').and.returnValue('arrayUnion');

  const change = {
    after: {
      data: () => ({
        editors: ['user1', 'user2', 'user3'],
        updatedById: 'user4',
        updatedBy: profile,
      }),
      ref: { update: jest.fn().mockReturnValue('updated') },
    },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateEditors);
  const req = await wrapped(change);
  const expected = {
    editors: 'arrayUnion',
    'editorsData.user4': profile,
  };

  expect(req).toBe('updated');
  expect(change.after.ref.update).toHaveBeenCalledWith(expected);
  expect(admin.firestore.FieldValue.arrayUnion).toHaveBeenCalledWith('user4');
  done();
});
