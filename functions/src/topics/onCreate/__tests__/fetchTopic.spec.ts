import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as helpers from '../../../helpers/wikipedia';

const testEnv = functions();
const db = admin.firestore();
testEnv.mockConfig({ admin: { uid: 'adminId' } });

import { onCreateTopicFetchData } from '../fetchTopic';

test('return when there a createdById field', async (done) => {
  spyOn(helpers, 'getWikipediaPage');

  const snap = {
    data: () => ({ createdById: 'userId' }),
  };
  const wrapped = testEnv.wrap(onCreateTopicFetchData);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(helpers.getWikipediaPage).not.toHaveBeenCalled();
  done();
});

test('fetch the topic data and update it', async (done) => {
  const data = { name: 'test user' };

  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => data,
  });

  spyOn(helpers, 'getWikipediaPage').and.returnValue({
    description: 'page description',
    photo: 'photo.png',
    title: 'Albert Einstein',
  });

  const snap = {
    data: () => ({ language: 'pt', updatedAt: 'today' }),
    id: 'Albert_Einstein_pt',
    ref: { update: jest.fn().mockReturnValue('updated') },
  };
  const wrapped = testEnv.wrap(onCreateTopicFetchData);
  const req = await wrapped(snap);
  const expected = {
    chapters: [],
    comments: 0,
    createdAt: 'timestamp',
    createdBy: data,
    createdById: 'adminId',
    description: 'page description',
    followers: 0,
    language: 'pt',
    likes: 0,
    photo: 'photo.png',
    posts: 0,
    title: 'Albert Einstein',
    topics: ['Albert_Einstein_pt'],
    updatedAt: 'timestamp',
    updatedBy: data,
    updatedById: 'adminId',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('profile/adminId');
  expect(helpers.getWikipediaPage).toHaveBeenCalledWith(
    'Albert_Einstein',
    'pt',
  );
  expect(snap.ref.update).toHaveBeenCalledWith(expected);
  done();
});
