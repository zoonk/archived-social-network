import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeletePostRemoveFromTimeline } from '../removeFromTimeline';

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('removed');
});

test('return when there are no posts', async (done) => {
  spyOn(db.collectionGroup('').where('', '==', ''), 'get').and.returnValue({
    empty: true,
  });
  const snap = { id: 'postId' };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromTimeline);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.collectionGroup).toHaveBeenCalledWith('timeline');
  expect(db.collectionGroup('').where).toHaveBeenCalledWith(
    'id',
    '==',
    'postId',
  );
  done();
});

test('remove posts from timeline', async (done) => {
  const post1 = { ref: { delete: jest.fn().mockReturnValue('post1Ref') } };
  const post2 = { ref: { delete: jest.fn().mockReturnValue('post2Ref') } };

  spyOn(db.collectionGroup('').where('', '==', ''), 'get').and.returnValue({
    empty: false,
    docs: [post1, post2],
  });
  const snap = { id: 'postId' };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromTimeline);
  const req = await wrapped(snap);

  expect(req).toBe('removed');
  expect(db.collectionGroup).toHaveBeenCalledWith('timeline');
  expect(db.collectionGroup('').where).toHaveBeenCalledWith(
    'id',
    '==',
    'postId',
  );
  expect(Promise.all).toHaveBeenCalledWith(['post1Ref', 'post2Ref']);
  done();
});
