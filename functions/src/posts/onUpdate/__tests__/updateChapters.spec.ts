import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdatePostUpdateChapters } from '../updateChapters';

const getDoc = () => ({
  ref: { update: jest.fn() },
});

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('updated');
});

test('return when there are no changes', async (done) => {
  const data = { title: 'title', content: 'desc' };
  const changes = {
    before: { data: () => ({ ...data, updatedAt: 'old' }) },
    after: { data: () => ({ ...data, updatedAt: 'new' }) },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateChapters);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('return when the category is neither examples nor lessons', async (done) => {
  const data = { category: 'posts', title: 'title', content: 'desc' };
  const changes = {
    before: { data: () => ({ ...data, updatedAt: 'old' }) },
    after: { data: () => ({ ...data, title: 'new', updatedAt: 'new' }) },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateChapters);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('update examples for all chapters', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [getDoc(), getDoc()],
  });

  const post = { title: 'new title', content: 'new desc' };
  const id = '1';
  const changes = {
    before: { data: () => ({ title: 'old title', content: 'old desc' }) },
    after: { data: () => ({ ...post, category: 'examples' }), id },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateChapters);
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
  const expected = { title: 'new title', description: 'new desc', id };

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('chapters');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'examples',
    'array-contains',
    '1',
  );
  expect(spy1).toHaveBeenCalledWith({ 'exampleData.1': expected });
  expect(spy2).toHaveBeenCalledWith({ 'exampleData.1': expected });
  done();
});

test('update lessons for all chapters', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [getDoc(), getDoc()],
  });

  const post = { title: 'new title', content: 'new desc' };
  const id = '1';
  const changes = {
    before: { data: () => ({ title: 'old title', content: 'old desc' }) },
    after: { data: () => ({ ...post, category: 'lessons' }), id },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateChapters);
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
  const expected = { title: 'new title', description: 'new desc', id };

  expect(req).toBe('updated');
  expect(db.collection).toHaveBeenCalledWith('chapters');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'lessons',
    'array-contains',
    '1',
  );
  expect(spy1).toHaveBeenCalledWith({ 'lessonData.1': expected });
  expect(spy2).toHaveBeenCalledWith({ 'lessonData.1': expected });
  done();
});
