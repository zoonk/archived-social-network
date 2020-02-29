import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateTopicUpdateChapters } from '../updateChapters';

const spyChapter = (id: string) => {
  when(db.doc as any)
    .calledWith(`chapters/${id}`)
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({ description: `desc ${id}`, title: `title ${id}` }),
        id,
      }),
    });
};

const chapterData = (id: string) => ({
  [`chapterData.${id}`]: {
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
    before: { data: () => ({ chapters: ['1', '2', '3', '4', '5'] }) },
    after: { data: () => ({ chapters: ['5', '4', '2', '3', '1'] }) },
  };
  const wrapped = testEnv.wrap(onUpdateTopicUpdateChapters);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(db.batch().commit).not.toHaveBeenCalled();
  done();
});

test('remove data from deleted chapters', async (done) => {
  spyOn(admin.firestore.FieldValue, 'delete').and.returnValue('removed');

  const changes = {
    before: { data: () => ({ chapters: ['1', '2', '3', '4'] }) },
    after: { data: () => ({ chapters: ['1', '3'] }), ref: 'removedRef' },
  };
  const wrapped = testEnv.wrap(onUpdateTopicUpdateChapters);
  const req = await wrapped(changes);
  const expected2 = { 'chapterData.2': 'removed' };
  const expected4 = { 'chapterData.4': 'removed' };

  expect(req).toBe('updated');
  expect(db.batch().update).toHaveBeenCalledWith('removedRef', expected2);
  expect(db.batch().update).toHaveBeenCalledWith('removedRef', expected4);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('update data for added chapters', async (done) => {
  spyChapter('3');
  spyChapter('4');

  const changes = {
    before: { data: () => ({ chapters: ['1', '2'] }) },
    after: { data: () => ({ chapters: ['1', '3', '2', '4'] }), ref: 'added' },
  };
  const wrapped = testEnv.wrap(onUpdateTopicUpdateChapters);
  const req = await wrapped(changes);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/3');
  expect(db.doc).toHaveBeenCalledWith('chapters/4');
  expect(db.batch().update).toHaveBeenCalledWith('added', chapterData('3'));
  expect(db.batch().update).toHaveBeenCalledWith('added', chapterData('4'));
  done();
});
