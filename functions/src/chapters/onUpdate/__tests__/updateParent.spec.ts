import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateChapterUpdateParentItem } from '../updateParent';

test('return when there are no changes', async (done) => {
  const data = { description: 'description', title: 'title' };
  const change = {
    before: { data: () => data },
    after: { data: () => ({ ...data, likes: 10 }) },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateParentItem);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test("update this chapter's topic", async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const oldData = {
    description: 'description',
    examples: [],
    lessons: [],
    title: 'title',
  };
  const newData = {
    description: 'new desc',
    examples: ['1', '2'],
    lessons: ['3'],
    title: 'new title',
  };
  const change = {
    before: { data: () => oldData },
    after: {
      data: () => ({ ...newData, topics: ['topicId'] }),
      id: 'chapterId',
    },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateParentItem);
  const req = await wrapped(change);
  const expected = {
    'chapterData.chapterId': {
      ...newData,
      examples: 2,
      id: 'chapterId',
      lessons: 1,
      posts: 3,
    },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/topicId');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});
