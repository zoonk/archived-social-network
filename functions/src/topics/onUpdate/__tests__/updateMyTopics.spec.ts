import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateTopicUpdateMyTopics } from '../updateMyTopics';

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('updated');
});

test('return when there are no changes', async (done) => {
  const data = {
    description: 'old',
    followers: 10,
    photo: 'old.png',
    title: 'old name',
    updatedAt: 'old',
  };
  const change = {
    before: { data: () => data },
    after: { data: () => ({ ...data, followers: 100 }), id: 'itemId' },
  };
  const wrapped = testEnv.wrap(onUpdateTopicUpdateMyTopics);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(db.doc).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('update all user topics', async (done) => {
  const docs = [{ id: 'user1' }, { id: 'user2' }];
  spyOn(db.collection(''), 'get').and.returnValue({ docs });
  spyOn(db.doc(''), 'update').and.returnValue('ref');

  const before = {
    description: 'old',
    photo: 'old.png',
    title: 'old name',
    updatedAt: 'old',
  };
  const after = {
    description: 'new',
    photo: 'new.png',
    title: 'new name',
    updatedAt: 'now',
  };
  const change = {
    before: { data: () => before },
    after: { data: () => after, id: 'itemId' },
  };
  const wrapped = testEnv.wrap(onUpdateTopicUpdateMyTopics);
  const req = await wrapped(change);

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('topics/itemId/followers');
  expect(db.doc).toHaveBeenCalledWith('users/user1/topics/itemId');
  expect(db.doc).toHaveBeenCalledWith('users/user2/topics/itemId');
  expect(db.doc('').update).toHaveBeenCalledWith(after);
  expect(Promise.all).toHaveBeenCalledWith(['ref', 'ref']);
  done();
});
