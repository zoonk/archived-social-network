import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onCreateFollowerAddToTimeline } from '../addToTimeline';

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue('added');
});

test('return when there are no posts to show', async (done) => {
  spyOn(
    db
      .collection('')
      .where('', '==', '')
      .orderBy('', 'desc')
      .limit(0),
    'get',
  ).and.returnValue({ empty: true });

  const params = { collection: 'groups', docId: 'id', userId: 'user' };
  const wrapped = testEnv.wrap(onCreateFollowerAddToTimeline);
  const req = await wrapped({}, { params });

  expect(req).toBe(false);
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection('').where).toHaveBeenCalledWith('groupId', '==', 'id');
  expect(db.collection('').where('', '==', '').orderBy).toHaveBeenCalledWith(
    'updatedAt',
    'desc',
  );
  done();
});

test('add topic posts to the timeline', async (done) => {
  const post1 = { title: 'post 1' };
  const post2 = { title: 'post 2' };
  const docs = [
    { id: 'post1', data: () => post1 },
    { id: 'post2', data: () => post2 },
  ];
  spyOn(
    db
      .collection('')
      .where('', '==', '')
      .orderBy('', 'desc')
      .limit(0),
    'get',
  ).and.returnValue({ empty: false, docs });

  when(db.doc as any)
    .calledWith('users/user/timeline/post1')
    .mockReturnValue('post1Ref');

  when(db.doc as any)
    .calledWith('users/user/timeline/post2')
    .mockReturnValue('post2Ref');

  const params = { collection: 'topics', docId: 'id', userId: 'user' };
  const wrapped = testEnv.wrap(onCreateFollowerAddToTimeline);
  const req = await wrapped({}, { params });
  const payload1 = { ...post1, id: 'post1' };
  const payload2 = { ...post2, id: 'post2' };

  expect(req).toBe('added');
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'topics',
    'array-contains',
    'id',
  );
  expect(db.collection('').where('', '==', '').orderBy).toHaveBeenCalledWith(
    'updatedAt',
    'desc',
  );
  expect(db.doc).toHaveBeenCalledWith('users/user/timeline/post1');
  expect(db.doc).toHaveBeenCalledWith('users/user/timeline/post2');
  expect(db.batch().set).toHaveBeenCalledWith('post1Ref', payload1);
  expect(db.batch().set).toHaveBeenCalledWith('post2Ref', payload2);
  done();
});

test('add group posts to the timeline', async (done) => {
  const post1 = { title: 'post 1' };
  const post2 = { title: 'post 2' };
  const docs = [
    { id: 'post1', data: () => post1 },
    { id: 'post2', data: () => post2 },
  ];
  spyOn(
    db
      .collection('')
      .where('', '==', '')
      .orderBy('', 'desc')
      .limit(0),
    'get',
  ).and.returnValue({ empty: false, docs });

  when(db.doc as any)
    .calledWith('users/user/timeline/post1')
    .mockReturnValue('post1Ref');

  when(db.doc as any)
    .calledWith('users/user/timeline/post2')
    .mockReturnValue('post2Ref');

  const params = { collection: 'groups', docId: 'id', userId: 'user' };
  const wrapped = testEnv.wrap(onCreateFollowerAddToTimeline);
  const req = await wrapped({}, { params });
  const payload1 = { ...post1, id: 'post1' };
  const payload2 = { ...post2, id: 'post2' };

  expect(req).toBe('added');
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection('').where).toHaveBeenCalledWith('groupId', '==', 'id');
  expect(db.collection('').where('', '==', '').orderBy).toHaveBeenCalledWith(
    'updatedAt',
    'desc',
  );
  expect(db.doc).toHaveBeenCalledWith('users/user/timeline/post1');
  expect(db.doc).toHaveBeenCalledWith('users/user/timeline/post2');
  expect(db.batch().set).toHaveBeenCalledWith('post1Ref', payload1);
  expect(db.batch().set).toHaveBeenCalledWith('post2Ref', payload2);
  done();
});
