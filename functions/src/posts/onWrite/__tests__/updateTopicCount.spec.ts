import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostUpdateTopicCount } from '../updateTopicCount';

test('returns when topics did not change', async (done) => {
  const data = {
    topics: ['topic1', 'topic2'],
  };
  const change = {
    before: { data: () => data },
    after: { data: () => data },
  };

  const wrapped = testEnv.wrap(onWritePostUpdateTopicCount);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.batch().set).not.toHaveBeenCalled();
  expect(db.batch().commit).not.toHaveBeenCalled();
  done();
});

test('increase count for added topics', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('topics increased');
  when(db.doc as any)
    .calledWith('topics/added2')
    .mockReturnValue('added2Ref');

  when(db.doc as any)
    .calledWith('topics/added3')
    .mockReturnValue('added3Ref');

  const meta = {
    language: 'en',
    updatedAt: 'today',
    updatedBy: { name: 'user' },
    updatedById: 'userId',
  };

  const change = {
    before: { data: () => ({ topics: ['topic1'] }) },
    after: {
      data: () => ({
        ...meta,
        topics: ['topic1', 'added2', 'added3'],
      }),
    },
  };

  const expected = {
    ...meta,
    posts: 1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateTopicCount);
  const req = await wrapped(change);

  expect(req).toBe('topics increased');
  expect(db.batch().set).toHaveBeenCalledWith('added2Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('added3Ref', expected, merge);
  done();
});

test('decrease count for removed topics', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('topics decreased');
  when(db.doc as any)
    .calledWith('topics/removed1')
    .mockReturnValue('removed1Ref');

  when(db.doc as any)
    .calledWith('topics/removed3')
    .mockReturnValue('removed3Ref');

  const meta = {
    language: 'en',
    updatedAt: 'today',
    updatedBy: { name: 'user' },
    updatedById: 'userId',
  };

  const change = {
    before: {
      data: () => ({ ...meta, topics: ['removed1', 'topic2', 'removed3'] }),
    },
    after: {
      data: () => ({
        topics: ['topic2'],
      }),
    },
  };

  const expected = {
    ...meta,
    posts: -1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateTopicCount);
  const req = await wrapped(change);

  expect(req).toBe('topics decreased');
  expect(db.batch().set).toHaveBeenCalledWith('removed1Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('removed3Ref', expected, merge);
  done();
});

test('increase count when a post is created', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('post created');
  when(db.doc as any)
    .calledWith('topics/created1')
    .mockReturnValue('created1Ref');

  when(db.doc as any)
    .calledWith('topics/created2')
    .mockReturnValue('created2Ref');

  const meta = {
    language: 'en',
    updatedAt: 'today',
    updatedBy: { name: 'user' },
    updatedById: 'userId',
  };

  const change = {
    before: { data: () => undefined },
    after: {
      data: () => ({
        ...meta,
        topics: ['created1', 'created2'],
      }),
    },
  };

  const expected = {
    ...meta,
    posts: 1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateTopicCount);
  const req = await wrapped(change);

  expect(req).toBe('post created');
  expect(db.batch().set).toHaveBeenCalledWith('created1Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('created2Ref', expected, merge);
  done();
});

test('decrease count when a post is deleted', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('post deleted');
  when(db.doc as any)
    .calledWith('topics/deleted1')
    .mockReturnValue('deleted1Ref');

  when(db.doc as any)
    .calledWith('topics/deleted2')
    .mockReturnValue('deleted2Ref');

  const meta = {
    language: 'en',
    updatedAt: 'today',
    updatedBy: { name: 'user' },
    updatedById: 'userId',
  };

  const change = {
    before: {
      data: () => ({ ...meta, topics: ['deleted1', 'deleted2'] }),
    },
    after: { data: () => undefined },
  };

  const expected = {
    ...meta,
    posts: -1,
  };
  const merge = { merge: true };

  const wrapped = testEnv.wrap(onWritePostUpdateTopicCount);
  const req = await wrapped(change);

  expect(req).toBe('post deleted');
  expect(db.batch().set).toHaveBeenCalledWith('deleted1Ref', expected, merge);
  expect(db.batch().set).toHaveBeenCalledWith('deleted2Ref', expected, merge);
  done();
});
