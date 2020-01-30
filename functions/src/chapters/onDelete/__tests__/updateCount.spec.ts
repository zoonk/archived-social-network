import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteChapterUpdateCount } from '../updateCount';

test('decrease the number of chapters and posts', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('chapter deleted');

  const snap = {
    data: () => ({ examples: 4, lessons: 6, posts: 10, pathId: 'pathId' }),
  };
  const wrapped = testEnv.wrap(onDeleteChapterUpdateCount);
  const req = await wrapped(snap);
  const expected = {
    chapters: -1,
    examples: -4,
    lessons: -6,
    posts: -10,
  };

  expect(req).toBe('chapter deleted');
  expect(db.doc).toHaveBeenCalledWith('paths/pathId');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});
