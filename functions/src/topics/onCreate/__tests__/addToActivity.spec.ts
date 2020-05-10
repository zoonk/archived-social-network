import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateTopicAddToActivity } from '../addToActivity';

test('do not send a request if there is no createdById', async (done) => {
  const data = {
    updatedAt: 'today',
    updatedById: 'editorId',
  };
  const snap = { data: () => data };

  const wrapped = testEnv.wrap(onCreateTopicAddToActivity);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(db.collection).not.toHaveBeenCalled();
  done();
});

test('send a request to add a new topic activities', async (done) => {
  const profile = { name: 'Leo', photo: 'leo.jpg' };
  const data = {
    createdById: 'editorId',
    language: 'en',
    title: 'new topic',
    updatedAt: 'today',
    updatedBy: profile,
    updatedById: 'editorId',
  };
  const snap = { data: () => data };
  const context = { params: { topicId: 'newTopic' } };
  const expected = {
    action: 'created',
    before: null,
    after: data,
    category: 'topics',
    categoryId: 'newTopic',
    createdById: 'editorId',
    itemPath: 'topics/newTopic',
    language: 'en',
    title: 'new topic',
    topics: ['newTopic'],
    updatedAt: 'today',
    user: profile,
    userNotification: [],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);

  const wrapped = testEnv.wrap(onCreateTopicAddToActivity);
  const req = await wrapped(snap, context);

  expect(req).toBe(true);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
