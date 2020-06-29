import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onWriteProgressUpdateTopic } from '../updateTopic';

beforeAll(() => {
  const chapterData = { topics: ['topicId'] };
  spyOn(db.doc(''), 'set').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({ data: () => chapterData });
});

test('update the lessons count for a topic', async (done) => {
  const data = { examples: new Array(2), lessons: new Array(4) };
  const change = {
    before: { data: () => undefined },
    after: { data: () => data },
  };
  const params = { chapterId: '123', userId: 'user' };
  const wrapped = testEnv.wrap(onWriteProgressUpdateTopic);
  const req = await wrapped(change, { params });
  const payload = { 123: { examples: 2, lessons: 4, posts: 6 } };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/topicId/progress/user');
  expect(db.doc).toHaveBeenCalledWith('chapters/123');
  expect(db.doc('').set).toHaveBeenCalledWith(payload, { merge: true });
  done();
});
