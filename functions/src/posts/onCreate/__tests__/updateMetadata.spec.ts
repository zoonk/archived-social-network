import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onCreatePostUpdateMetadata } from '../updateMetadata';

test('return when a post does not have a chapterId', async (done) => {
  const snap = {
    data: () => ({ chapterId: null }),
    ref: { update: jest.fn() },
  };
  const wrapped = testEnv.wrap(onCreatePostUpdateMetadata);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(snap.ref.update).not.toHaveBeenCalled();
  done();
});

test('update a post metadata', async (done) => {
  const chapter = {
    description: 'chapter description',
    photo: 'chapter.png',
    title: 'chapter title',
  };
  const path = {
    description: 'path description',
    photo: 'path.png',
    title: 'path title',
  };
  const snap = {
    data: () => ({ chapterId: 'chapter-id' }),
    ref: { update: jest.fn() },
  };

  spyOn(snap.ref, 'update').and.returnValue('updated');
  when(db.doc as any)
    .calledWith('chapters/chapter-id')
    .mockReturnValue({
      get: () => ({
        data: () => ({ ...chapter, pathId: 'path-id', likes: 5 }),
      }),
    });
  when(db.doc as any)
    .calledWith('paths/path-id')
    .mockReturnValue({
      get: () => ({ data: () => ({ ...path, likes: 10 }) }),
    });

  const wrapped = testEnv.wrap(onCreatePostUpdateMetadata);
  const req = await wrapped(snap);
  const expected = {
    chapter: { ...chapter, id: 'chapter-id' },
    path: { ...path, id: 'path-id' },
    pathId: 'path-id',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapter-id');
  expect(db.doc).toHaveBeenCalledWith('paths/path-id');
  expect(snap.ref.update).toHaveBeenCalledWith(expected);
  done();
});
