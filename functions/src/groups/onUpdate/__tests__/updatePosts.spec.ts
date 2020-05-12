import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateGroupUpdatePosts } from '../updatePosts';

beforeAll(() => {
  spyOn(Promise, 'all').and.returnValue('updated');
});

test('return when there are no changes', async (done) => {
  const data = { description: 'desc', photo: 'group.png', title: 'name' };
  const change = {
    before: { data: () => data },
    after: { data: () => ({ ...data, followers: 10, updatedAt: 'today' }) },
  };
  const wrapped = testEnv.wrap(onUpdateGroupUpdatePosts);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.collection).not.toHaveBeenCalled();
  expect(Promise.all).not.toHaveBeenCalled();
  done();
});

test('update all posts', async (done) => {
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { ref: { update: jest.fn().mockReturnValue('doc1') } },
      { ref: { update: jest.fn().mockReturnValue('doc2') } },
    ],
  });

  const before = { description: 'old', photo: 'old.png', title: 'old name' };
  const after = { description: 'new', photo: 'new.png', title: 'new name' };
  const change = {
    before: { data: () => before },
    after: { data: () => ({ ...after, followers: 3 }), id: 'itemId' },
  };
  const wrapped = testEnv.wrap(onUpdateGroupUpdatePosts);
  const req = await wrapped(change);
  const groupData = { ...after, id: 'itemId' };

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
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'groupId',
    '==',
    'itemId',
  );
  expect(spy1).toHaveBeenCalledWith({ groupData });
  expect(spy2).toHaveBeenCalledWith({ groupData });
  expect(Promise.all).toHaveBeenCalledWith(['doc1', 'doc2']);
  done();
});
