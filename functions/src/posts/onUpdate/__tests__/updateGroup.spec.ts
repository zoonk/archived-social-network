import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdatePostUpdateGroup } from '../updateGroup';

test('return when there is no groupId', async (done) => {
  const before = { comments: 1, content: 'old', title: 'old' };
  const after = { comments: 2, content: 'new', title: 'new' };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateGroup);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when there are no changes', async (done) => {
  const data = { comments: 1, content: 'old', groupId: 'itemId', title: 'old' };
  const change = {
    before: { data: () => data },
    after: { data: () => ({ ...data, updatedAt: 'now' }) },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateGroup);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('update when someone writes a comment', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const updates = {
    updatedAt: 'now',
    updatedBy: { name: 'user' },
    updatedById: 'userId',
  };
  const data = {
    ...updates,
    content: 'test',
    groupId: 'itemId',
    title: 'test',
  };
  const before = { ...data, comments: 1 };
  const after = { ...data, comments: 2 };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateGroup);
  const req = await wrapped(change);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/itemId');
  expect(db.doc('').update).toHaveBeenCalledWith(updates);
  done();
});

test('update when the content changed', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const updates = {
    updatedAt: 'now',
    updatedBy: { name: 'user' },
    updatedById: 'userId',
  };
  const data = {
    ...updates,
    comments: 30,
    groupId: 'itemId',
    title: 'test',
  };
  const before = { ...data, content: 'old' };
  const after = { ...data, content: 'new' };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateGroup);
  const req = await wrapped(change);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/itemId');
  expect(db.doc('').update).toHaveBeenCalledWith(updates);
  done();
});

test('update when the title changed', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const updates = {
    updatedAt: 'now',
    updatedBy: { name: 'user' },
    updatedById: 'userId',
  };
  const data = {
    ...updates,
    comments: 42,
    content: 'test',
    groupId: 'itemId',
  };
  const before = { ...data, title: 'old' };
  const after = { ...data, title: 'new' };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onUpdatePostUpdateGroup);
  const req = await wrapped(change);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/itemId');
  expect(db.doc('').update).toHaveBeenCalledWith(updates);
  done();
});
