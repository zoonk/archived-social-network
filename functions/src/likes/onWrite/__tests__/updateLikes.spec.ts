import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onWriteCategoryLikeUpdateCount } from '../updateLikes';

test('return if the data did not change', async (done) => {
  const change = {
    before: { data: () => ({ like: false }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateCount);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('increment the likes count', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ like: true }) },
  };
  const context = { params: { category: 'topics', categoryId: 'topicId' } };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateCount);
  const req = await wrapped(change, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/topicId');
  expect(db.doc('').update).toHaveBeenCalledWith({ likes: 1 });
  done();
});

test('decrement the likes count', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const change = {
    before: { data: () => ({ like: true }) },
    after: { data: () => undefined },
  };
  const context = { params: { category: 'topics', categoryId: 'topicId' } };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateCount);
  const req = await wrapped(change, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/topicId');
  expect(db.doc('').update).toHaveBeenCalledWith({ likes: -1 });
  done();
});
