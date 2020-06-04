import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onCreatePostAddToTimeline } from '../addToTimeline';

beforeEach(() => {
  jest.clearAllMocks();
});

test('add a post to all group followers', async (done) => {
  when(db.doc as any)
    .calledWith('users/user1/timeline/post1')
    .mockReturnValue({
      set: jest.fn().mockReturnValue('user1Ref'),
    });

  when(db.doc as any)
    .calledWith('users/user2/timeline/post1')
    .mockReturnValue({
      set: jest.fn().mockReturnValue('user2Ref'),
    });

  const docs = [{ id: 'user1' }, { id: 'user2' }];
  const data = { groupId: 'id', title: 'post title', topics: [] };
  const snap = { id: 'post1', data: () => data };

  spyOn(db.collection(''), 'get').and.returnValue({ docs });

  const wrapped = testEnv.wrap(onCreatePostAddToTimeline);
  const req = await wrapped(snap);

  expect(req).toEqual(['user1Ref', 'user2Ref']);
  expect(db.collection).toHaveBeenCalledWith('groups/id/followers');
  expect(db.collection('').get).toHaveBeenCalledTimes(1);
  expect(db.doc).toHaveBeenCalledWith('users/user1/timeline/post1');
  expect(db.doc).toHaveBeenCalledWith('users/user2/timeline/post1');
  done();
});

test('add a post to all topic followers', async (done) => {
  const topic1 = [{ id: 'user1' }, { id: 'user2' }];
  const topic2 = [{ id: 'user1' }, { id: 'user2' }, { id: 'user3' }];

  when(db.collection as any)
    .calledWith('topics/1/followers')
    .mockReturnValue({ get: jest.fn().mockReturnValue({ docs: topic1 }) });

  when(db.collection as any)
    .calledWith('topics/2/followers')
    .mockReturnValue({ get: jest.fn().mockReturnValue({ docs: topic2 }) });

  when(db.doc as any)
    .calledWith('users/user1/timeline/post1')
    .mockReturnValue({
      set: jest.fn().mockReturnValue('user1Ref'),
    });

  when(db.doc as any)
    .calledWith('users/user2/timeline/post1')
    .mockReturnValue({
      set: jest.fn().mockReturnValue('user2Ref'),
    });

  when(db.doc as any)
    .calledWith('users/user3/timeline/post1')
    .mockReturnValue({
      set: jest.fn().mockReturnValue('user3Ref'),
    });

  const data = { groupId: null, title: 'post title', topics: ['1', '2'] };
  const snap = { id: 'post1', data: () => data };

  const wrapped = testEnv.wrap(onCreatePostAddToTimeline);
  const req = await wrapped(snap);

  expect(req).toEqual(['user1Ref', 'user2Ref', 'user3Ref']);
  expect(db.collection).toHaveBeenCalledWith('topics/1/followers');
  expect(db.collection).toHaveBeenCalledWith('topics/2/followers');
  expect(db.doc).toHaveBeenCalledWith('users/user1/timeline/post1');
  expect(db.doc).toHaveBeenCalledWith('users/user2/timeline/post1');
  expect(db.doc).toHaveBeenCalledWith('users/user3/timeline/post1');
  expect(db.doc).toHaveBeenCalledTimes(3);
  done();
});
