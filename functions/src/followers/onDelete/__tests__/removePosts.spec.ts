import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteFollowerRemovePosts } from '../removePosts';

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('removed');
});

test('return when there are no posts to remove', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    empty: true,
  });

  const params = { collection: 'topics', docId: 'id', userId: 'user' };
  const wrapped = testEnv.wrap(onDeleteFollowerRemovePosts);
  const req = await wrapped({}, { params });

  expect(req).toBe(false);
  expect(db.collection).toHaveBeenCalledWith('users/user/timeline');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'topics',
    'array-contains',
    'id',
  );
  done();
});

test('remove all posts from groups', async (done) => {
  const post1 = { ref: { delete: jest.fn().mockReturnValue('post1Ref') } };
  const post2 = { ref: { delete: jest.fn().mockReturnValue('post2Ref') } };

  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    empty: false,
    docs: [post1, post2],
  });

  const params = { collection: 'groups', docId: 'id', userId: 'user' };
  const wrapped = testEnv.wrap(onDeleteFollowerRemovePosts);
  const req = await wrapped({}, { params });

  expect(req).toBe('removed');
  expect(db.collection).toHaveBeenCalledWith('users/user/timeline');
  expect(db.collection('').where).toHaveBeenCalledWith('groupId', '==', 'id');
  expect(Promise.all).toHaveBeenCalledWith(['post1Ref', 'post2Ref']);
  done();
});

test('remove all posts from topics', async (done) => {
  const post1 = { ref: { delete: jest.fn().mockReturnValue('post1Ref') } };
  const post2 = { ref: { delete: jest.fn().mockReturnValue('post2Ref') } };

  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    empty: false,
    docs: [post1, post2],
  });

  const params = { collection: 'topics', docId: 'id', userId: 'user' };
  const wrapped = testEnv.wrap(onDeleteFollowerRemovePosts);
  const req = await wrapped({}, { params });

  expect(req).toBe('removed');
  expect(db.collection).toHaveBeenCalledWith('users/user/timeline');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'topics',
    'array-contains',
    'id',
  );
  expect(Promise.all).toHaveBeenCalledWith(['post1Ref', 'post2Ref']);
  done();
});
