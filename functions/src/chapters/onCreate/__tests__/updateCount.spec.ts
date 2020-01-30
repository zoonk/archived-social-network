import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateChapterUpdateCount } from '../updateCount';

test('increase the number of chapters on create', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('chapter created');

  const snap = { data: () => ({ pathId: 'pathId' }) };
  const wrapped = testEnv.wrap(onCreateChapterUpdateCount);
  const req = await wrapped(snap);

  expect(req).toBe('chapter created');
  expect(db.doc).toHaveBeenCalledWith('paths/pathId');
  expect(db.doc('').update).toHaveBeenCalledWith({ chapters: 1 });
  done();
});
