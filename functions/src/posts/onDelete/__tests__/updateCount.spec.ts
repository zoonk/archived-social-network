import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeletePostUpdateCount } from '../updateCount';

test('return when there is no chapterId', async (done) => {
  const snap = { data: () => ({ chapterId: null }) };
  const wrapped = testEnv.wrap(onDeletePostUpdateCount);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('decrement the count for examples', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const snap = {
    data: () => ({ category: 'examples', chapterId: 'doc1' }),
  };
  const wrapped = testEnv.wrap(onDeletePostUpdateCount);
  const req = await wrapped(snap);
  const expected = {
    examples: -1,
    lessons: 0,
    posts: -1,
  };

  expect(req).toEqual('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/doc1');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});

test('decrement the count for lessons', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const snap = {
    data: () => ({ category: 'lessons', chapterId: 'doc2' }),
  };
  const wrapped = testEnv.wrap(onDeletePostUpdateCount);
  const req = await wrapped(snap);
  const expected = {
    examples: 0,
    lessons: -1,
    posts: -1,
  };

  expect(req).toEqual('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/doc2');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});

test('do not decrement the count for other categories', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const snap = {
    data: () => ({ category: 'questions', chapterId: 'doc3' }),
  };
  const wrapped = testEnv.wrap(onDeletePostUpdateCount);
  const req = await wrapped(snap);
  const expected = {
    examples: 0,
    lessons: 0,
    posts: -1,
  };

  expect(req).toEqual('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/doc3');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});
