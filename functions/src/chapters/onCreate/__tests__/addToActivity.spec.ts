import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateChapterAddToActivity } from '../addToActivity';

test('send a request to add a new item to activities', async (done) => {
  const profile = { name: 'Leo', photo: 'leo.jpg' };
  const data = {
    createdById: 'editorId',
    language: 'en',
    title: 'new item',
    topics: ['topicId'],
    updatedAt: 'timestamp',
  };
  const snap = { data: () => data };
  const context = { params: { id: 'newItem' } };
  const expected = {
    action: 'created',
    before: null,
    after: data,
    category: 'chapters',
    categoryId: 'newItem',
    createdById: 'editorId',
    itemPath: 'chapters/newItem',
    language: 'en',
    title: 'new item',
    topics: ['topicId'],
    updatedAt: 'timestamp',
    user: profile,
    userNotification: [],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);
  spyOn(db, 'doc').and.returnValue({
    get: jest.fn().mockReturnValue({
      data: () => profile,
    }),
  });

  const wrapped = testEnv.wrap(onCreateChapterAddToActivity);
  const req = await wrapped(snap, context);

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('profile/editorId');
  expect(db.doc).toHaveBeenCalledTimes(1);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
