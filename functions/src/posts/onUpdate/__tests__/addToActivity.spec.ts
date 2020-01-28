import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdatePostAddToActivity } from '../addToActivity';

test('return when there are no changes', async (done) => {
  const data = {
    description: 'description',
    language: 'en',
    order: {},
    photo: 'photo.jpg',
    title: 'topic name',
    updatedById: 'editorId',
  };
  const beforeData = {
    ...data,
    likes: 10,
  };
  const afterData = {
    ...data,
    likes: 30,
  };
  const before = { data: () => beforeData };
  const after = { data: () => afterData };
  const changes = { after, before };
  const context = { params: { id: 'itemId' } };

  const wrapped = testEnv.wrap(onUpdatePostAddToActivity);
  const req = await wrapped(changes, context);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(db.collection).not.toHaveBeenCalled();
  done();
});

test('send a request to add a new item to activities', async (done) => {
  const profile = { name: 'Leo', photo: 'leo.jpg' };
  const data = {
    createdById: 'authorId',
    language: 'en',
    order: {},
    topics: ['topicId'],
    updatedById: 'editorId',
  };
  const beforeData = {
    ...data,
    content: 'old content',
    links: ['link 1'],
    title: 'old title',
  };
  const afterData = {
    ...data,
    content: 'new content',
    links: ['link1', 'link2'],
    title: 'new title',
    updatedAt: 'today',
  };
  const before = { data: () => beforeData };
  const after = { data: () => afterData };
  const changes = { after, before };
  const context = { params: { id: 'itemId' } };
  const expected = {
    action: 'updated',
    after: afterData,
    before: beforeData,
    category: 'posts',
    categoryId: 'itemId',
    createdById: 'editorId',
    itemPath: 'posts/itemId',
    language: 'en',
    title: 'new title',
    topics: ['topicId'],
    updatedAt: 'today',
    user: profile,
    userNotification: ['authorId'],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);
  spyOn(db, 'doc').and.returnValue({
    get: jest.fn().mockReturnValue({
      data: () => profile,
    }),
  });

  const wrapped = testEnv.wrap(onUpdatePostAddToActivity);
  const req = await wrapped(changes, context);

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('profile/editorId');
  expect(db.doc).toHaveBeenCalledTimes(1);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
