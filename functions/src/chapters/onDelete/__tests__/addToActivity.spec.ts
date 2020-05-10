import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteChapterAddToActivity } from '../addToActivity';

test('send a request to add a new delete to activities', async (done) => {
  const profile = { name: 'Leo', photo: 'leo.jpg' };
  const beforeData = {
    createdById: 'authorId',
    description: 'old description',
    language: 'en',
    title: 'old title',
    topics: ['topicId'],
    updatedAt: 'timestamp',
    updatedBy: profile,
    updatedById: 'editorId',
    url: 'old link',
  };
  const snap = { data: () => ({ ...beforeData }) };
  const context = { params: { id: 'itemId' } };
  const expected = {
    action: 'deleted',
    after: null,
    before: beforeData,
    category: 'chapters',
    categoryId: 'itemId',
    createdById: 'editorId',
    itemPath: 'chapters/itemId',
    language: 'en',
    title: 'old title',
    topics: ['topicId'],
    updatedAt: 'timestamp',
    user: profile,
    userNotification: ['authorId'],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);

  const wrapped = testEnv.wrap(onDeleteChapterAddToActivity);
  const req = await wrapped(snap, context);

  expect(req).toBe(true);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
