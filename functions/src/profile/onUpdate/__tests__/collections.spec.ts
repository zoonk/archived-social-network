import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateProfileUpdateCollections } from '../collections';

const data = {
  bio: 'artist',
  name: 'Leo',
  photo: 'davinci.jpg',
};

const change = {
  before: { data: () => ({}) },
  after: { data: () => data },
};

afterEach(() => {
  jest.clearAllMocks();
});

test('return when the data did not change', async (done) => {
  const noChange = {
    before: {
      data: () => ({ bio: 'artist', name: 'Leo', photo: 'davinci.jpg' }),
    },
    after: {
      data: () => ({ bio: 'artist', name: 'Leo', photo: 'davinci.jpg' }),
    },
  };

  const wrapped = testEnv.wrap(onUpdateProfileUpdateCollections);
  const req = await wrapped(noChange, { params: { uid: 'testUID' } });

  expect(req).toBe(false);
  done();
});

test('should update the profile for all collections', async (done) => {
  spyOn(Promise, 'all').and.returnValue('updated');
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { ref: { update: jest.fn().mockReturnValue('doc1') } },
      { ref: { update: jest.fn().mockReturnValue('doc2') } },
    ],
  });

  const wrapped = testEnv.wrap(onUpdateProfileUpdateCollections);
  const req = await wrapped(change, { params: { uid: 'testUID' } });

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
  expect(db.collection).toHaveBeenCalledWith('chapters');
  expect(db.collection).toHaveBeenCalledWith('comments');
  expect(db.collection).toHaveBeenCalledWith('groups');
  expect(db.collection).toHaveBeenCalledWith('posts');
  expect(db.collection).toHaveBeenCalledWith('replies');
  expect(db.collection).toHaveBeenCalledWith('topics');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'createdById',
    '==',
    'testUID',
  );
  expect(db.collection('').where).toHaveBeenCalledWith(
    'updatedById',
    '==',
    'testUID',
  );
  expect(spy1).toHaveBeenCalledWith({ createdBy: data });
  expect(spy2).toHaveBeenCalledWith({ updatedBy: data });
  expect(spy1).toHaveBeenCalledTimes(12);
  expect(spy2).toHaveBeenCalledTimes(12);
  expect(Promise.all).toHaveBeenCalledWith(['doc1', 'doc2']);
  done();
});
