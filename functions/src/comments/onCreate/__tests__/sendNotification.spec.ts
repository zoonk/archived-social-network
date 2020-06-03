import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();
const batch = db.batch();

import { onCreateCommentSendNotification } from '../sendNotification';

beforeAll(() => {
  spyOn(batch, 'commit').and.returnValue('sent');
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('do not send a notification to the post author when they comment their own post', async (done) => {
  const comment = { commentId: null, createdById: 'author', postId: 'postId' };
  const post = { createdById: 'author' };
  const snap = { data: () => comment };

  spyOn(db.doc(''), 'get').and.returnValue({ data: () => post });

  const wrapped = testEnv.wrap(onCreateCommentSendNotification);
  const req = await wrapped(snap);

  expect(req).toEqual('sent');
  expect(db.doc).toHaveBeenCalledWith('posts/postId');
  expect(db.collection).not.toHaveBeenCalled();
  expect(batch.set).not.toHaveBeenCalled();
  done();
});

test('send a notification to the post author', async (done) => {
  const comment = {
    commentId: null,
    createdBy: { name: 'user name' },
    createdById: 'author',
    language: 'en',
    postId: 'postId',
  };
  const post = { createdById: 'other', title: 'post title' };
  const snap = { data: () => comment, id: 'commentId' };

  spyOn(db.doc(''), 'get').and.returnValue({ data: () => post });
  when(db.collection as any)
    .calledWith('users/other/notifications')
    .mockReturnValue({
      doc: jest.fn().mockReturnValue('notRef'),
    });

  const wrapped = testEnv.wrap(onCreateCommentSendNotification);
  const req = await wrapped(snap);
  const notification = {
    action: 'created',
    activityId: null,
    category: 'comments',
    itemPath: 'comments/commentId',
    language: 'en',
    title: 'post title',
    type: 'comments',
    updatedAt: 'timestamp',
    user: { name: 'user name' },
  };

  expect(req).toEqual('sent');
  expect(db.doc).toHaveBeenCalledWith('posts/postId');
  expect(db.collection).toHaveBeenCalledWith('users/other/notifications');
  expect(db.collection).toHaveBeenCalledTimes(1);
  expect(batch.set).toHaveBeenCalledWith('notRef', notification);
  expect(batch.set).toHaveBeenCalledTimes(1);
  done();
});

test('do not send a notification to the comment author when replying to their own comment', async (done) => {
  const comment = {
    commentId: 'commentId',
    createdById: 'author',
    postId: 'postId',
  };
  const parent = { createdById: 'author' };
  const post = { createdById: 'author' };
  const snap = { data: () => comment };

  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({ get: jest.fn().mockReturnValue({ data: () => post }) });
  when(db.doc as any)
    .calledWith('comments/commentId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({ data: () => parent }),
    });

  const wrapped = testEnv.wrap(onCreateCommentSendNotification);
  const req = await wrapped(snap);

  expect(req).toEqual('sent');
  expect(db.doc).toHaveBeenCalledWith('posts/postId');
  expect(db.doc).toHaveBeenCalledWith('comments/commentId');
  expect(db.collection).not.toHaveBeenCalled();
  expect(batch.set).not.toHaveBeenCalled();
  done();
});

test('send a notification for replies to the comment author', async (done) => {
  const comment = {
    commentId: 'parent',
    createdBy: { name: 'user name' },
    createdById: 'author',
    language: 'en',
    postId: 'postId',
  };
  const post = { createdById: 'author', title: 'post title' };
  const parent = { createdById: 'other' };
  const snap = { data: () => comment, id: 'commentId' };

  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({ get: jest.fn().mockReturnValue({ data: () => post }) });
  when(db.doc as any)
    .calledWith('comments/parent')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({ data: () => parent }),
    });
  when(db.collection as any)
    .calledWith('users/other/notifications')
    .mockReturnValue({
      doc: jest.fn().mockReturnValue('notRef'),
    });

  const wrapped = testEnv.wrap(onCreateCommentSendNotification);
  const req = await wrapped(snap);
  const notification = {
    action: 'created',
    activityId: null,
    category: 'comments',
    itemPath: 'comments/commentId',
    language: 'en',
    title: 'post title',
    type: 'comments',
    updatedAt: 'timestamp',
    user: { name: 'user name' },
  };

  expect(req).toEqual('sent');
  expect(db.doc).toHaveBeenCalledWith('posts/postId');
  expect(db.doc).toHaveBeenCalledWith('comments/parent');
  expect(db.collection).toHaveBeenCalledWith('users/other/notifications');
  expect(db.collection).toHaveBeenCalledTimes(1);
  expect(batch.set).toHaveBeenCalledWith('notRef', notification);
  expect(batch.set).toHaveBeenCalledTimes(1);
  done();
});
