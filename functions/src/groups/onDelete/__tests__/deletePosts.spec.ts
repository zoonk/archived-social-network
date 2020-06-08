import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteGroupRemovePosts } from '../deletePosts';

test('remove all posts from a group', async (done) => {
  spyOn(Promise, 'all').and.returnValue('removed');

  const post1 = { ref: { delete: jest.fn().mockReturnValue('post1Ref') } };
  const post2 = { ref: { delete: jest.fn().mockReturnValue('post2Ref') } };

  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [post1, post2],
  });

  const snap = { id: 'groupId' };
  const wrapped = testEnv.wrap(onDeleteGroupRemovePosts);
  const req = await wrapped(snap);

  expect(req).toBe('removed');
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'groupId',
    '==',
    'groupId',
  );
  expect(post1.ref.delete).toHaveBeenCalledTimes(1);
  expect(post2.ref.delete).toHaveBeenCalledTimes(1);
  expect(Promise.all).toHaveBeenCalledWith(['post1Ref', 'post2Ref']);
  done();
});
