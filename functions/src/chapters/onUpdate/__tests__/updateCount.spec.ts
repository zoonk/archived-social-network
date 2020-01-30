import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateChapterUpdateCount } from '../updateCount';

test('update the number of posts', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('chapter updated');

  const changes = {
    before: { data: () => ({ examples: 10, lessons: 6, posts: 16 }) },
    after: {
      data: () => ({ examples: 4, lessons: 9, posts: 13, pathId: 'pathId' }),
    },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateCount);
  const req = await wrapped(changes);
  const expected = {
    examples: -6,
    lessons: 3,
    posts: -3,
  };

  expect(req).toBe('chapter updated');
  expect(db.doc).toHaveBeenCalledWith('paths/pathId');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});
