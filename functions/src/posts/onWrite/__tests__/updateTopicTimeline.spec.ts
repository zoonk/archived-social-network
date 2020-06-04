import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';
import { isEqual } from 'lodash';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostUpdateTopicTimeline } from '../updateTopicTimeline';

test('return when there are no changes', async (done) => {
  spyOn(Promise, 'all').and.returnValue('updated');

  const data = { title: 'post title', topics: ['topic1', 'topic2'] };
  const before = { data: () => data };
  const after = { data: () => ({ ...data, otherField: 'test' }) };
  const change = { before, after };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateTopicTimeline);
  const req = await wrapped(change, { params });

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(db.doc).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('return when the post is deleted', async (done) => {
  spyOn(Promise, 'all').and.returnValue('updated');

  const data = { title: 'post title', topics: ['topic1', 'topic2'] };
  const before = { data: () => data };
  const after = { data: () => undefined };
  const change = { before, after };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateTopicTimeline);
  const req = await wrapped(change, { params });

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(db.doc).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('delete post from removed topics', async (done) => {
  const topic1 = [{ id: 'user1' }, { id: 'user2' }];
  const topic2 = [{ id: 'user1' }, { id: 'user2' }, { id: 'user3' }];

  Promise.all = jest.fn().mockImplementation((args) => {
    const topicRefs = ['topic1Ref', 'topic2Ref'];
    if (isEqual(args, topicRefs)) return [{ docs: topic1 }, { docs: topic2 }];
    return [];
  });

  db.doc = jest.fn().mockImplementation((args) => {
    return { delete: jest.fn().mockReturnValue(args) };
  });

  const oldData = { title: 'post title', topics: ['topic1', 'topic2'] };
  const newData = { title: 'post title', topics: [] };
  const before = { data: () => oldData };
  const after = { data: () => newData };
  const change = { before, after };
  const params = { id: 'postId' };

  when(db.collection as any)
    .calledWith('topics/topic1/followers')
    .mockReturnValue({ get: jest.fn().mockReturnValue('topic1Ref') });

  when(db.collection as any)
    .calledWith('topics/topic2/followers')
    .mockReturnValue({ get: jest.fn().mockReturnValue('topic2Ref') });

  const wrapped = testEnv.wrap(onWritePostUpdateTopicTimeline);
  await wrapped(change, { params });

  expect(db.collection).toHaveBeenCalledWith('topics/topic1/followers');
  expect(db.collection).toHaveBeenCalledWith('topics/topic2/followers');
  expect(Promise.all).toHaveBeenCalledWith(['topic1Ref', 'topic2Ref']);
  expect(db.doc).toHaveBeenCalledWith('users/user1/timeline/postId');
  expect(db.doc).toHaveBeenCalledWith('users/user2/timeline/postId');
  expect(db.doc).toHaveBeenCalledWith('users/user3/timeline/postId');
  expect(Promise.all).toHaveBeenCalledWith([
    'users/user1/timeline/postId',
    'users/user2/timeline/postId',
    'users/user3/timeline/postId',
  ]);
  done();
});

test('update post for all topic followers', async (done) => {
  const topic1 = [{ id: 'user1' }, { id: 'user2' }];
  const topic2 = [{ id: 'user1' }, { id: 'user2' }, { id: 'user3' }];

  Promise.all = jest.fn().mockImplementation((args) => {
    const topicRefs = ['topic1Ref', 'topic2Ref'];
    if (isEqual(args, topicRefs)) return [{ docs: topic1 }, { docs: topic2 }];
    return args;
  });

  db.doc = jest.fn().mockImplementation((args) => {
    return { set: jest.fn().mockReturnValue(args) };
  });

  const oldData = { title: 'old title', topics: ['topic1', 'topic2'] };
  const newData = { title: 'new title', topics: ['topic1', 'topic2'] };
  const before = { data: () => oldData };
  const after = { data: () => newData };
  const change = { before, after };
  const params = { id: 'postId' };

  when(db.collection as any)
    .calledWith('topics/topic1/followers')
    .mockReturnValue({ get: jest.fn().mockReturnValue('topic1Ref') });

  when(db.collection as any)
    .calledWith('topics/topic2/followers')
    .mockReturnValue({ get: jest.fn().mockReturnValue('topic2Ref') });

  const wrapped = testEnv.wrap(onWritePostUpdateTopicTimeline);
  const req = await wrapped(change, { params });

  expect(db.collection).toHaveBeenCalledWith('topics/topic1/followers');
  expect(db.collection).toHaveBeenCalledWith('topics/topic2/followers');
  expect(Promise.all).toHaveBeenCalledWith(['topic1Ref', 'topic2Ref']);
  expect(db.doc).toHaveBeenCalledWith('users/user1/timeline/postId');
  expect(db.doc).toHaveBeenCalledWith('users/user2/timeline/postId');
  expect(db.doc).toHaveBeenCalledWith('users/user3/timeline/postId');
  expect(req).toEqual([
    'users/user1/timeline/postId',
    'users/user2/timeline/postId',
    'users/user3/timeline/postId',
  ]);
  done();
});
