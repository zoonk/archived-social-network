import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteDocUpdateStats } from '../updateStats';

beforeAll(() => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');
});

test('do not update untracked collections', async (done) => {
  const context = { params: { collection: 'leaderboard' } };
  const wrapped = testEnv.wrap(onDeleteDocUpdateStats);
  const req = await wrapped({}, context);

  expect(req).toBe(false);
  done();
});

test('update the chapters count', async (done) => {
  const context = { params: { collection: 'chapters' } };
  const wrapped = testEnv.wrap(onDeleteDocUpdateStats);
  const req = await wrapped({}, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('admin/stats');
  expect(db.doc('').update).toHaveBeenCalledWith({ chapters: -1 });
  done();
});

test('update the groups count', async (done) => {
  const context = { params: { collection: 'groups' } };
  const wrapped = testEnv.wrap(onDeleteDocUpdateStats);
  const req = await wrapped({}, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('admin/stats');
  expect(db.doc('').update).toHaveBeenCalledWith({ groups: -1 });
  done();
});

test('update the comments count', async (done) => {
  const context = { params: { collection: 'comments' } };
  const wrapped = testEnv.wrap(onDeleteDocUpdateStats);
  const req = await wrapped({}, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('admin/stats');
  expect(db.doc('').update).toHaveBeenCalledWith({ comments: -1 });
  done();
});

test('update the posts count', async (done) => {
  const snap = { data: () => ({ category: 'examples' }) };
  const context = { params: { collection: 'posts' } };
  const wrapped = testEnv.wrap(onDeleteDocUpdateStats);
  const req = await wrapped(snap, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('admin/stats');
  expect(db.doc('').update).toHaveBeenCalledWith({
    examples: -1,
    timeline: -1,
  });
  done();
});

test('update the topics count', async (done) => {
  const context = { params: { collection: 'topics' } };
  const wrapped = testEnv.wrap(onDeleteDocUpdateStats);
  const req = await wrapped({}, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('admin/stats');
  expect(db.doc('').update).toHaveBeenCalledWith({ topics: -1 });
  done();
});

test('update the users count', async (done) => {
  const context = { params: { collection: 'users' } };
  const wrapped = testEnv.wrap(onDeleteDocUpdateStats);
  const req = await wrapped({}, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('admin/stats');
  expect(db.doc('').update).toHaveBeenCalledWith({ users: -1 });
  done();
});
