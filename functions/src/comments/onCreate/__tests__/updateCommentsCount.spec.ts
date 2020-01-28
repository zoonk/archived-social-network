import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateCommentUpdateCount } from '../updateCommentsCount';

test('increase the comments count', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('count updated');

  const data = { postId: 'itemId' };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateCommentUpdateCount);
  const req = await wrapped(snap);

  expect(req).toBe('count updated');
  expect(db.doc).toHaveBeenCalledWith('posts/itemId');
  expect(db.doc('').update).toHaveBeenCalledWith({ comments: 1 });
  done();
});
