import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onWriteChapterProgressUpdatePath } from '../updatePath';

test("update a user's progress", async (done) => {
  spyOn(db.doc(''), 'set').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => ({ pathId: 'pathId' }),
  });

  const change = {
    before: { data: () => ({ examples: 6, lessons: 10, posts: 16 }) },
    after: { data: () => ({ examples: 7, lessons: 4, posts: 11 }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'userId' } };
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdatePath);
  const req = await wrapped(change, context);
  const expected = {
    examples: 1,
    lessons: -6,
    posts: -5,
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc).toHaveBeenCalledWith('paths/pathId/progress/userId');
  expect(db.doc('').set).toHaveBeenCalledWith(expected, { merge: true });
  done();
});

test("update a user's progress when it's created", async (done) => {
  spyOn(db.doc(''), 'set').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => ({ pathId: 'pathId' }),
  });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ examples: 7, lessons: 4, posts: 11 }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'userId' } };
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdatePath);
  const req = await wrapped(change, context);
  const expected = {
    examples: 7,
    lessons: 4,
    posts: 11,
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc).toHaveBeenCalledWith('paths/pathId/progress/userId');
  expect(db.doc('').set).toHaveBeenCalledWith(expected, { merge: true });
  done();
});

test("update a user's progress when it's deleted", async (done) => {
  spyOn(db.doc(''), 'set').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => ({ pathId: 'pathId' }),
  });

  const change = {
    before: { data: () => ({ examples: 7, lessons: 4, posts: 11 }) },
    after: { data: () => undefined },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'userId' } };
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdatePath);
  const req = await wrapped(change, context);
  const expected = {
    examples: -7,
    lessons: -4,
    posts: -11,
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc).toHaveBeenCalledWith('paths/pathId/progress/userId');
  expect(db.doc('').set).toHaveBeenCalledWith(expected, { merge: true });
  done();
});
