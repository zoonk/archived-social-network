import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateProfileUpdateEditors } from '../editors';

const profile = {
  bio: 'artist',
  name: 'Leo',
  photo: 'davinci.jpg',
  username: 'test',
};

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('updated');
});

test('return when the profile did not change', async (done) => {
  const change = {
    before: { data: () => profile },
    after: { data: () => profile, id: 'userId' },
  };

  const wrapped = testEnv.wrap(onUpdateProfileUpdateEditors);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('update all posts when the profile changes', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { ref: { update: jest.fn().mockReturnValue('doc1') } },
      { ref: { update: jest.fn().mockReturnValue('doc2') } },
    ],
  });

  const newProfile = {
    bio: 'new bio',
    name: 'new name',
    photo: 'new_photo.png',
    username: 'new_username',
  };
  const change = {
    before: { data: () => profile },
    after: { data: () => newProfile, id: 'userId' },
  };

  const wrapped = testEnv.wrap(onUpdateProfileUpdateEditors);
  const req = await wrapped(change);

  const spy1 = (
    await db
      .collection('')
      .where('', '==', '')
      .get()
  ).docs[0].ref.update;
  const spy2 = (
    await db
      .collection('')
      .where('', '==', '')
      .get()
  ).docs[1].ref.update;

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'editors',
    'array-contains',
    'userId',
  );
  expect(spy1).toHaveBeenCalledWith({ 'editorsData.userId': newProfile });
  expect(spy2).toHaveBeenCalledWith({ 'editorsData.userId': newProfile });
  expect(Promise.all).toHaveBeenCalledWith(['doc1', 'doc2']);
  done();
});
