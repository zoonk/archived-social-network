import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeletePostRemoveFromProgress } from '../removeFromProgress';

const post1 = { ref: { update: jest.fn().mockReturnValue('post1Ref') } };
const post2 = { ref: { update: jest.fn().mockReturnValue('post2Ref') } };

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('removed');
});

test('return when there is no chapterId', async (done) => {
  const data = { chapterId: null };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromProgress);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.collectionGroup).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('remove examples', async (done) => {
  spyOn(db.collectionGroup('').where('', '==', ''), 'get').and.returnValue({
    docs: [post1, post2],
  });

  const data = { category: 'examples', chapterId: 'chapterId' };
  const snap = { data: () => data, id: 'exampleId' };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromProgress);
  const req = await wrapped(snap);

  expect(req).toBe('removed');
  expect(db.collectionGroup).toHaveBeenCalledWith('progress');
  expect(db.collectionGroup('').where).toHaveBeenCalledWith(
    'examples',
    'array-contains',
    'exampleId',
  );
  expect(Promise.all).toHaveBeenCalledWith(['post1Ref', 'post2Ref']);
  done();
});

test('remove lessons', async (done) => {
  spyOn(db.collectionGroup('').where('', '==', ''), 'get').and.returnValue({
    docs: [post1, post2],
  });

  const data = { category: 'lessons', chapterId: 'chapterId' };
  const snap = { data: () => data, id: 'lessonId' };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromProgress);
  const req = await wrapped(snap);

  expect(req).toBe('removed');
  expect(db.collectionGroup).toHaveBeenCalledWith('progress');
  expect(db.collectionGroup('').where).toHaveBeenCalledWith(
    'lessons',
    'array-contains',
    'lessonId',
  );
  expect(Promise.all).toHaveBeenCalledWith(['post1Ref', 'post2Ref']);
  done();
});
