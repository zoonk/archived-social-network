import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreatePostAddToActivity } from '../addToActivity';

test('send a request to add a new item to activities', async (done) => {
  const profile = { name: 'Leo', photo: 'leo.jpg' };
  const data = {
    createdById: 'editorId',
    language: 'en',
    title: 'new item',
    topics: ['topicId'],
    updatedAt: 'today',
    updatedBy: profile,
  };
  const snap = { data: () => data };
  const context = { params: { id: 'newItem' } };
  const expected = {
    action: 'created',
    before: null,
    after: data,
    category: 'posts',
    categoryId: 'newItem',
    createdById: 'editorId',
    itemPath: 'posts/newItem',
    language: 'en',
    title: 'new item',
    topics: ['topicId'],
    updatedAt: 'today',
    user: profile,
    userNotification: [],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);

  const wrapped = testEnv.wrap(onCreatePostAddToActivity);
  const req = await wrapped(snap, context);

  expect(req).toBe(true);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
