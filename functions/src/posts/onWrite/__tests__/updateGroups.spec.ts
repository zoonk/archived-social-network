import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostUpdateGroups } from '../updateGroups';

test('return when the pinned value is always falsy', async (done) => {
  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ pinned: false }) },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateGroups);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when the pinned value is always truthy', async (done) => {
  const data = { pinned: true, groupId: 'itemId' };
  const change = {
    before: { data: () => data },
    after: { data: () => data },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateGroups);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when there is no groupId', async (done) => {
  const change = {
    before: { data: () => ({ pinned: false }) },
    after: { data: () => ({ pinned: true }) },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateGroups);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('remove post from group when pinned becomes false', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const change = {
    before: { data: () => ({ pinned: true, groupId: 'groupId' }) },
    after: { data: () => ({ pinned: false }) },
  };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateGroups);
  const req = await wrapped(change, { params });
  const payload = {
    pinned: 'removed: postId',
    'pinnedPosts.postId': 'deleted',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId');
  expect(db.doc('').update).toHaveBeenCalledWith(payload);
  done();
});

test('remove post from group when it is deleted', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const change = {
    before: { data: () => ({ pinned: true, groupId: 'groupId' }) },
    after: { data: () => undefined },
  };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateGroups);
  const req = await wrapped(change, { params });
  const payload = {
    pinned: 'removed: postId',
    'pinnedPosts.postId': 'deleted',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId');
  expect(db.doc('').update).toHaveBeenCalledWith(payload);
  done();
});

test('add post to group when pinned becomes true', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const data = {
    content:
      '[{ "type": "paragraph", "children": [{ "text": "title text." }] }]',
    cover: 'photo.png',
    title: 'name',
  };
  const change = {
    before: { data: () => ({ pinned: false, groupId: null }) },
    after: { data: () => ({ ...data, pinned: true, groupId: 'groupId' }) },
  };
  const params = { id: 'postId' };
  const wrapped = testEnv.wrap(onWritePostUpdateGroups);
  const req = await wrapped(change, { params });
  const payload = {
    pinned: 'added: postId',
    'pinnedPosts.postId': {
      cover: 'photo.png',
      description: 'title text.',
      title: 'name',
      id: 'postId',
    },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId');
  expect(db.doc('').update).toHaveBeenCalledWith(payload);
  done();
});
