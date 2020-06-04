import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostUpdateGroupTimeline } from '../updateGroupTimeline';

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('updated');
});

test('return when there is no groupId', async (done) => {
  const before = { data: () => ({ groupId: null }) };
  const after = { data: () => ({}) };
  const change = { before, after };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateGroupTimeline);
  const req = await wrapped(change, { params });

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(db.doc).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('return when there the post is deleted', async (done) => {
  const before = { data: () => ({ groupId: null }) };
  const after = { data: () => undefined };
  const change = { before, after };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateGroupTimeline);
  const req = await wrapped(change, { params });

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(db.doc).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('return when there are no changes', async (done) => {
  const data = { groupId: 'test', title: 'post title' };
  const before = { data: () => data };
  const after = { data: () => ({ ...data, otherField: 'test' }) };
  const change = { before, after };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateGroupTimeline);
  const req = await wrapped(change, { params });

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(db.doc).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('add this post to the timeline', async (done) => {
  const oldData = { groupId: 'test', title: 'old title' };
  const newData = { groupId: 'test', title: 'new title' };
  const before = { data: () => oldData };
  const after = { data: () => newData };
  const change = { before, after };
  const params = { id: 'postId' };
  const docs = [{ id: 'user1' }, { id: 'user2' }];

  spyOn(db.collection(''), 'get').and.returnValue({ docs });

  when(db.doc as any)
    .calledWith('users/user1/timeline/postId')
    .mockReturnValue({
      set: jest.fn().mockReturnValue('user1Ref'),
    });

  when(db.doc as any)
    .calledWith('users/user2/timeline/postId')
    .mockReturnValue({
      set: jest.fn().mockReturnValue('user2Ref'),
    });

  const wrapped = testEnv.wrap(onWritePostUpdateGroupTimeline);
  const req = await wrapped(change, { params });

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('groups/test/followers');
  expect(db.collection('').get).toHaveBeenCalledTimes(1);
  expect(db.doc).toHaveBeenCalledWith('users/user1/timeline/postId');
  expect(db.doc).toHaveBeenCalledWith('users/user2/timeline/postId');
  expect(Promise.all).toHaveBeenCalledWith(['user1Ref', 'user2Ref']);
  done();
});
