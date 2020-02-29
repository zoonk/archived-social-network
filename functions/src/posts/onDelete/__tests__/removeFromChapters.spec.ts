import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeletePostRemoveFromChapters } from '../removeFromChapters';

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('removed');
});

test('return if the category is not an example or lesson', async (done) => {
  const snap = { data: () => ({ category: 'posts' }) };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromChapters);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('return when an example does not belong to any chapters', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    empty: true,
  });

  const snap = { id: 'exampleId', data: () => ({ category: 'examples' }) };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromChapters);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.collection).toHaveBeenCalledWith('chapters');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'examples',
    'array-contains',
    'exampleId',
  );
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('return when a lesson does not belong to any chapters', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    empty: true,
  });

  const snap = { id: 'lessonId', data: () => ({ category: 'lessons' }) };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromChapters);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.collection).toHaveBeenCalledWith('chapters');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'lessons',
    'array-contains',
    'lessonId',
  );
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('send a request to remove an example from all chapters', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { id: '1', ref: { update: jest.fn().mockReturnValue('example1') } },
      { id: '2', ref: { update: jest.fn().mockReturnValue('example2') } },
    ],
  });

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

  const snap = { id: 'exampleId', data: () => ({ category: 'examples' }) };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromChapters);
  const req = await wrapped(snap);
  const examples = admin.firestore.FieldValue.arrayRemove();

  expect(req).toEqual('removed');
  expect(db.collection).toHaveBeenCalledWith('chapters');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'examples',
    'array-contains',
    'exampleId',
  );
  expect(admin.firestore.FieldValue.arrayRemove).toHaveBeenCalledWith(
    'exampleId',
  );
  expect(spy1).toHaveBeenCalledWith({ examples });
  expect(spy2).toHaveBeenCalledWith({ examples });
  expect(Promise.all).toHaveBeenCalledWith(['example1', 'example2']);
  done();
});

test('send a request to remove a lesson from all chapters', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { id: '1', ref: { update: jest.fn().mockReturnValue('lesson1') } },
      { id: '2', ref: { update: jest.fn().mockReturnValue('lesson2') } },
    ],
  });

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

  const snap = { id: 'lessonId', data: () => ({ category: 'lessons' }) };
  const wrapped = testEnv.wrap(onDeletePostRemoveFromChapters);
  const req = await wrapped(snap);
  const lessons = admin.firestore.FieldValue.arrayRemove();

  expect(req).toEqual('removed');
  expect(db.collection).toHaveBeenCalledWith('chapters');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'lessons',
    'array-contains',
    'lessonId',
  );
  expect(admin.firestore.FieldValue.arrayRemove).toHaveBeenCalledWith(
    'lessonId',
  );
  expect(spy1).toHaveBeenCalledWith({ lessons });
  expect(spy2).toHaveBeenCalledWith({ lessons });
  expect(Promise.all).toHaveBeenCalledWith(['lesson1', 'lesson2']);
  done();
});
