import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateChapterAddToActivity } from '../addToActivity';

test('return when there are no changes', async (done) => {
  const data = {
    description: 'description',
    language: 'en',
    order: 1,
    photo: 'photo.jpg',
    title: 'topic name',
    updatedById: 'editorId',
  };
  const beforeData = {
    ...data,
    likes: 10,
    updatedAt: 'old',
  };
  const afterData = {
    ...data,
    likes: 30,
  };
  const before = { data: () => beforeData };
  const after = { data: () => afterData };
  const changes = { after, before };
  const context = { params: { id: 'itemId' } };

  const wrapped = testEnv.wrap(onUpdateChapterAddToActivity);
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
    topics: ['topicId'],
    updatedBy: profile,
    updatedById: 'editorId',
  };
  const beforeData = {
    ...data,
    description: 'old description',
    order: 1,
    photo: 'old_photo.jpg',
    title: 'old title',
  };
  const afterData = {
    ...data,
    description: 'new description',
    order: 2,
    photo: 'new_photo.png',
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
    category: 'chapters',
    categoryId: 'itemId',
    createdById: 'editorId',
    itemPath: 'chapters/itemId',
    language: 'en',
    title: 'new title',
    topics: ['topicId'],
    updatedAt: 'today',
    user: profile,
    userNotification: ['authorId'],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);

  const wrapped = testEnv.wrap(onUpdateChapterAddToActivity);
  const req = await wrapped(changes, context);

  expect(req).toBe(true);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
