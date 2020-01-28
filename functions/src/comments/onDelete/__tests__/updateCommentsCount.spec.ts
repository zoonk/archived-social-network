import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteCommentUpdateCount } from '../updateCommentsCount';

test('decrease the comments count', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('count updated');

  const data = { postId: 'itemId', replies: 3 };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onDeleteCommentUpdateCount);
  const req = await wrapped(snap);

  expect(req).toBe('count updated');
  expect(db.doc).toHaveBeenCalledWith('posts/itemId');
  expect(db.doc('').update).toHaveBeenCalledWith({ comments: -4 });
  done();
});
