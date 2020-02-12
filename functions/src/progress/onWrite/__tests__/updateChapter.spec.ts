import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostProgressUpdateChapter } from '../updateChapter';

test('return if the data did not change', async (done) => {
  const change = {
    before: { data: () => ({ completed: false }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateChapter);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return if the post does not have a chapterId', async (done) => {
  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => ({ chapterId: null, category: 'lessons' }),
  });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ completed: true }) },
  };
  const context = { params: { postId: 'postId', userId: 'userId' } };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateChapter);
  const req = await wrapped(change, context);

  expect(req).toBe(false);
  expect(db.doc).toHaveBeenCalledWith('posts/postId');
  expect(db.doc).not.toHaveBeenCalledWith('chapters/null/progress/userId');
  expect(db.doc('').set).not.toHaveBeenCalled();
  done();
});

test('increment the completed counter', async (done) => {
  spyOn(db.doc(''), 'set').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => ({ chapterId: 'chapterId', category: 'lessons' }),
  });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ completed: true }) },
  };
  const context = { params: { postId: 'postId', userId: 'userId' } };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateChapter);
  const req = await wrapped(change, context);
  const expected = {
    examples: 0,
    lessons: 1,
    posts: 1,
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('posts/postId');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId/progress/userId');
  expect(db.doc('').set).toHaveBeenCalledWith(expected, { merge: true });
  done();
});

test('decrement the completed counter', async (done) => {
  spyOn(db.doc(''), 'set').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => ({ chapterId: 'chapter2', category: 'examples' }),
  });

  const change = {
    before: { data: () => ({ completed: true }) },
    after: { data: () => ({ completed: false }) },
  };
  const context = { params: { postId: 'post2', userId: 'user2' } };
  const wrapped = testEnv.wrap(onWritePostProgressUpdateChapter);
  const req = await wrapped(change, context);
  const expected = {
    examples: -1,
    lessons: 0,
    posts: -1,
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('posts/post2');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapter2/progress/user2');
  expect(db.doc('').set).toHaveBeenCalledWith(expected, { merge: true });
  done();
});
