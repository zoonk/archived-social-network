import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onCreateActivityUpdateLastActivity } from '../updateLastActivity';

test('do not send a request to update when an item was deleted', async (done) => {
  const data = {
    action: 'deleted',
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityUpdateLastActivity);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.batch).not.toHaveBeenCalled();
  done();
});

test('send a request to update the updatedAt field', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue(true);
  when(db.doc as any)
    .calledWith('topics/topic1')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2')
    .mockReturnValue('topic2Ref');

  const data = {
    createdById: 'editorId',
    language: 'en',
    topics: ['topic1', 'topic2'],
    updatedAt: 'today',
    user: { name: 'user' },
  };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateActivityUpdateLastActivity);
  const req = await wrapped(snap);
  const expected = {
    language: 'en',
    updatedAt: 'today',
    updatedBy: { name: 'user' },
    updatedById: 'editorId',
  };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('topics/topic1');
  expect(db.doc).toHaveBeenCalledWith('topics/topic2');
  expect(db.batch().set).toHaveBeenCalledWith('topic1Ref', expected, {
    merge: true,
  });
  expect(db.batch().set).toHaveBeenCalledWith('topic2Ref', expected, {
    merge: true,
  });
  done();
});
