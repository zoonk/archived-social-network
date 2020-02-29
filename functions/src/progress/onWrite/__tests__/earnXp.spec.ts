import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onWriteChapterProgressUpdateXP } from '../earnXp';

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue(true);
});

test('return if the number of posts did not change', async (done) => {
  const change = {
    before: { data: () => ({ examples: [], lessons: [] }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when users complete their own content', async (done) => {
  when(db.doc as any)
    .calledWith('chapters/chapterId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'editorId',
        }),
      }),
    });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ examples: ['test1'] }) },
  };
  const context = {
    params: {
      chapterId: 'chapterId',
      userId: 'editorId',
    },
  };
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalledWith('leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic1/leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic2/leaderboard/editorId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/topic3/leaderboard/editorId');
  done();
});

test('increase XP when a lesson is completed', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('chapters/chapterId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ lessons: ['test1'] }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: 1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});

test('increase XP when an example is completed', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('chapters/chapterId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ examples: ['test1'] }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: 1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});

test('increase XP when the posts count increases', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('chapters/chapterId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => ({ lessons: ['1'], examples: ['1'] }) },
    after: { data: () => ({ lessons: ['1', '2'], examples: ['1', '2'] }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: 2,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});

test('decrease XP when a lesson is removed from the list', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('chapters/chapterId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => ({ lessons: ['1'] }) },
    after: { data: () => ({ lessons: [] }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: -1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});

test('decrease XP when an example is removed from the list', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('chapters/chapterId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => ({ examples: ['1'] }) },
    after: { data: () => ({ examples: [] }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: -1,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});

test('decrease XP when the posts count decreases', async (done) => {
  const spy = spyOn(db.batch(), 'set');

  when(db.doc as any)
    .calledWith('leaderboard/editorId')
    .mockReturnValue('leaderboardRef');

  when(db.doc as any)
    .calledWith('topics/topic1/leaderboard/editorId')
    .mockReturnValue('topic1Ref')
    .calledWith('topics/topic2/leaderboard/editorId')
    .mockReturnValue('topic2Ref')
    .calledWith('topics/topic3/leaderboard/editorId')
    .mockReturnValue('topic3Ref');

  when(db.doc as any)
    .calledWith('chapters/chapterId')
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({
          topics: ['topic1', 'topic2', 'topic3'],
          createdById: 'otherEditor',
        }),
      }),
    });

  const change = {
    before: { data: () => ({ lessons: ['1', '2'], examples: ['1', '2'] }) },
    after: { data: () => ({ lessons: ['1'], examples: ['1'] }) },
  };
  const context = { params: { chapterId: 'chapterId', userId: 'editorId' } };
  const expected = {
    createdById: 'editorId',
    xp: -2,
  };
  const merge = true;
  const wrapped = testEnv.wrap(onWriteChapterProgressUpdateXP);
  const req = await wrapped(change, context);

  expect(req).toBe(true);
  expect(spy).toHaveBeenCalledWith('leaderboardRef', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic1Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic2Ref', expected, { merge });
  expect(spy).toHaveBeenCalledWith('topic3Ref', expected, { merge });
  done();
});
