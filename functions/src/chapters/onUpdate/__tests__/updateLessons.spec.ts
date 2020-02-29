import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateChapterUpdateLessons } from '../updateLessons';

const spyLesson = (id: string) => {
  when(db.doc as any)
    .calledWith(`posts/${id}`)
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({ content: `desc ${id}`, title: `title ${id}` }),
        id,
      }),
    });
};

const lessonData = (id: string) => ({
  [`lessonData.${id}`]: {
    id,
    description: `desc ${id}`,
    title: `title ${id}`,
  },
});

beforeAll(() => {
  spyOn(db.batch(), 'commit').and.returnValue('updated');
});

test('return when there are no changes', async (done) => {
  const changes = {
    before: { data: () => ({ lessons: ['1', '2', '3', '4', '5'] }) },
    after: { data: () => ({ lessons: ['5', '4', '2', '3', '1'] }) },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateLessons);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(db.batch().commit).not.toHaveBeenCalled();
  done();
});

test('remove data from deleted lessons', async (done) => {
  spyOn(admin.firestore.FieldValue, 'delete').and.returnValue('removed');

  const changes = {
    before: { data: () => ({ lessons: ['1', '2', '3', '4'] }) },
    after: { data: () => ({ lessons: ['1', '3'] }), ref: 'removedRef' },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateLessons);
  const req = await wrapped(changes);
  const expected2 = { 'lessonData.2': 'removed' };
  const expected4 = { 'lessonData.4': 'removed' };

  expect(req).toBe('updated');
  expect(db.batch().update).toHaveBeenCalledWith('removedRef', expected2);
  expect(db.batch().update).toHaveBeenCalledWith('removedRef', expected4);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('update data for added lessons', async (done) => {
  spyLesson('3');
  spyLesson('4');

  const changes = {
    before: { data: () => ({ lessons: ['1', '2'] }) },
    after: { data: () => ({ lessons: ['1', '3', '2', '4'] }), ref: 'added' },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateLessons);
  const req = await wrapped(changes);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('posts/3');
  expect(db.doc).toHaveBeenCalledWith('posts/4');
  expect(db.batch().update).toHaveBeenCalledWith('added', lessonData('3'));
  expect(db.batch().update).toHaveBeenCalledWith('added', lessonData('4'));
  done();
});
