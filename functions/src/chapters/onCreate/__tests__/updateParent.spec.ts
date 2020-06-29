import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateChapterUpdateParentItem } from '../updateParent';

test("update the chapter's data for the parent item", async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const data = {
    description: 'description',
    title: 'title',
    topics: ['topicId'],
  };
  const snap = { data: () => data, id: 'chapterId' };
  const wrapped = testEnv.wrap(onCreateChapterUpdateParentItem);
  const req = await wrapped(snap);
  const expected = {
    chapters: 'added: chapterId',
    'chapterData.chapterId': {
      description: 'description',
      examples: 0,
      id: 'chapterId',
      lessons: 0,
      posts: 0,
      title: 'title',
    },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/topicId');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});
