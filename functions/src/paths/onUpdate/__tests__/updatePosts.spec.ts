import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdatePathUpdatePosts } from '../updatePosts';

test('return when summary fields did not change', async (done) => {
  const spy = spyOn(Promise, 'all');

  const data = { description: 'desc', photo: null, title: 'title' };
  const changes = {
    before: { data: () => ({ ...data, likes: 13 }) },
    after: { data: () => ({ ...data, likes: 100 }) },
  };

  const wrapped = testEnv.wrap(onUpdatePathUpdatePosts);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(spy).not.toHaveBeenCalled();
  done();
});

test('update path data for all posts', async (done) => {
  spyOn(Promise, 'all').and.returnValue('updated');
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { ref: { update: jest.fn().mockReturnValue('doc1') } },
      { ref: { update: jest.fn().mockReturnValue('doc2') } },
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

  const before = { description: 'old', photo: 'old.png', title: 'old' };
  const after = { description: 'new desc', photo: 'new.png', title: 'new' };
  const changes = {
    before: { data: () => ({ ...before, likes: 13 }) },
    after: { data: () => ({ ...after, likes: 100 }), id: 'path-id' },
  };

  const wrapped = testEnv.wrap(onUpdatePathUpdatePosts);
  const req = await wrapped(changes);
  const path = { ...after };

  expect(req).toEqual('updated');
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'pathId',
    '==',
    'path-id',
  );
  expect(spy1).toHaveBeenCalledWith({ path });
  expect(spy2).toHaveBeenCalledWith({ path });
  expect(Promise.all).toHaveBeenCalledWith(['doc1', 'doc2']);
  done();
});
