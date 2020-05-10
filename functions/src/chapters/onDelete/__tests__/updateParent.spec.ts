import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteChapterUpdateParent } from '../updateParent';

test('remove chapter from topic', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const data = { topics: ['topicId'] };
  const snap = { data: () => data, id: 'chapterId' };
  const wrapped = testEnv.wrap(onDeleteChapterUpdateParent);
  const req = await wrapped(snap);
  const payload = {
    chapters: 'removed: chapterId',
    'chapterData.chapterId': 'deleted',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/topicId');
  expect(db.doc('').update).toHaveBeenCalledWith(payload);
  done();
});
