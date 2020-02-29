import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateChapterUpdateTopics } from '../updateTopics';

const getDoc = () => ({
  ref: { update: jest.fn() },
});

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('updated');
});

test('return when there are no changes', async (done) => {
  const data = { title: 'title', description: 'desc' };
  const changes = {
    before: { data: () => ({ ...data, updatedAt: 'old' }) },
    after: { data: () => ({ ...data, updatedAt: 'new' }) },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateTopics);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('update all topics', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [getDoc(), getDoc()],
  });

  const chapter = { title: 'new title', description: 'new desc' };
  const id = '1';
  const changes = {
    before: { data: () => ({ title: 'old title', description: 'old desc' }) },
    after: { data: () => chapter, id },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateTopics);
  const req = await wrapped(changes);

  const spy1 = (
    await db
      .collection('')
      .where('', '==', '')
      .get()
  ).docs[0].ref.update;
  const spy2 = (
    await db
      .collection('')
      .where('', '==', '')
      .get()
  ).docs[1].ref.update;

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('topics');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'chapters',
    'array-contains',
    '1',
  );
  expect(spy1).toHaveBeenCalledWith({ 'chapterData.1': { ...chapter, id } });
  expect(spy2).toHaveBeenCalledWith({ 'chapterData.1': { ...chapter, id } });
  done();
});
