import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateTopicAddToActivity } from '../addToActivity';

test('return when there are no changes', async (done) => {
  const data = {
    description: 'description',
    language: 'en',
    photo: 'photo.png',
    title: 'topic name',
    updatedById: 'editorId',
  };
  const before = {
    data: () => ({ ...data, updatedAt: 'yesterday', likes: 10 }),
  };
  const after = {
    data: () => ({ ...data, updatedAt: 'today', likes: 30 }),
  };
  const changes = { after, before };
  const context = { params: { topicId: 'topicId' } };

  const wrapped = testEnv.wrap(onUpdateTopicAddToActivity);
  const req = await wrapped(changes, context);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(db.collection).not.toHaveBeenCalled();
  done();
});

test('send a request to add a new item to activities', async (done) => {
  const profile = { name: 'Leo', photo: 'leo.jpg' };
  const data = {
    language: 'en',
    title: 'topic name',
    updatedBy: profile,
    updatedById: 'editorId',
  };
  const beforeData = {
    ...data,
    description: 'old description',
    photo: 'oldPhoto.png',
  };
  const afterData = {
    ...data,
    description: 'new description',
    photo: 'newPhoto.png',
    updatedAt: 'today',
  };
  const before = { data: () => beforeData };
  const after = { data: () => afterData };
  const changes = { after, before };
  const context = { params: { topicId: 'topicId' } };
  const expected = {
    action: 'updated',
    after: afterData,
    before: beforeData,
    category: 'topics',
    categoryId: 'topicId',
    createdById: 'editorId',
    itemPath: 'topics/topicId',
    language: 'en',
    title: 'topic name',
    topics: ['topicId'],
    updatedAt: 'today',
    user: profile,
    userNotification: [],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);

  const wrapped = testEnv.wrap(onUpdateTopicAddToActivity);
  const req = await wrapped(changes, context);

  expect(req).toBe(true);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
