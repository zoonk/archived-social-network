import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteCommentUpdateCount } from '../updateCommentsCount';

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue('count updated');
});

afterEach(() => {
  jest.clearAllMocks();
});

test('decrease the comments count', async (done) => {
  when(db.doc as any)
    .calledWith('posts/itemId')
    .mockReturnValue('postRef');

  const data = { postId: 'itemId', replies: 3 };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onDeleteCommentUpdateCount);
  const req = await wrapped(snap);

  expect(req).toBe('count updated');
  expect(db.doc).toHaveBeenCalledWith('posts/itemId');
  expect(db.batch().update).toHaveBeenCalledWith('postRef', { comments: -4 });
  expect(db.batch().update).toHaveBeenCalledTimes(1);
  done();
});

test('decrease the replies count', async (done) => {
  when(db.doc as any)
    .calledWith('posts/itemId')
    .mockReturnValue('postRef');

  when(db.doc as any)
    .calledWith('comments/commentId')
    .mockReturnValue('commentRef');

  const data = { commentId: 'commentId', postId: 'itemId', replies: 0 };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onDeleteCommentUpdateCount);
  const req = await wrapped(snap);

  expect(req).toBe('count updated');
  expect(db.doc).toHaveBeenCalledWith('posts/itemId');
  expect(db.doc).toHaveBeenCalledWith('comments/commentId');
  expect(db.batch().update).toHaveBeenCalledWith('postRef', { comments: -1 });
  expect(db.batch().update).toHaveBeenCalledWith('commentRef', { replies: -1 });
  expect(db.batch().update).toHaveBeenCalledTimes(2);
  done();
});
