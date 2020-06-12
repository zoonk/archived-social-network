import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateProfileUpdateFollowers } from '../followers';

test('return when there are no changes', async (done) => {
  const data = { bio: 'test', name: 'Leo', photo: 'pic.jpg', username: 'same' };
  const noChange = {
    before: { data: () => data },
    after: { data: () => data },
  };

  const wrapped = testEnv.wrap(onUpdateProfileUpdateFollowers);
  const req = await wrapped(noChange);

  expect(req).toBe(false);
  done();
});

test('update the profile for every doc', async (done) => {
  spyOn(Promise, 'all').and.returnValue('updated');
  spyOn(db.collectionGroup('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { ref: { update: jest.fn().mockReturnValue('doc1') } },
      { ref: { update: jest.fn().mockReturnValue('doc2') } },
    ],
  });

  const data = {
    bio: 'artist',
    name: 'Leo',
    photo: 'davinci.jpg',
    username: 'newUsername',
  };

  const change = {
    before: { data: () => ({ username: 'oldUsername' }) },
    after: { data: () => data },
  };
  const wrapped = testEnv.wrap(onUpdateProfileUpdateFollowers);
  const req = await wrapped(change, { params: { uid: 'testUID' } });

  const spy1 = (
    await db
      .collectionGroup('')
      .where('', '==', '')
      .get()
  ).docs[0].ref.update;
  const spy2 = (
    await db
      .collectionGroup('')
      .where('', '==', '')
      .get()
  ).docs[1].ref.update;

  expect(req).toBe('updated');
  expect(db.collectionGroup).toHaveBeenCalledWith('followers');
  expect(db.collectionGroup('').where('username', '==', 'oldUsername'));
  expect(spy1).toHaveBeenCalledWith(data);
  expect(spy2).toHaveBeenCalledWith(data);
  expect(Promise.all).toHaveBeenCalledWith(['doc1', 'doc2']);
  done();
});
