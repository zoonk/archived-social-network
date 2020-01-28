import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onCreateReplyUpdateCount } from '../updateRepliesCount';

test('increase the comments count', async (done) => {
  spyOn(db.batch(), 'commit').and.returnValue('count updated');
  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue('postRef')
    .calledWith('comments/commentId')
    .mockReturnValue('commentRef');

  const data = { commentId: 'commentId', postId: 'postId' };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateReplyUpdateCount);
  const req = await wrapped(snap);

  expect(req).toBe('count updated');
  expect(db.batch().update).toHaveBeenCalledWith('postRef', { comments: 1 });
  expect(db.batch().update).toHaveBeenCalledWith('commentRef', {
    replies: 1,
  });
  done();
});
