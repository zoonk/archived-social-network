import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();

import { onUpdateChapterUpdateExamples } from '../updateExamples';

const spyExample = (id: string) => {
  when(db.doc as any)
    .calledWith(`posts/${id}`)
    .mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: () => ({ content: `desc ${id}`, title: `title ${id}` }),
        id,
      }),
    });
};

const exampleData = (id: string) => ({
  [`exampleData.${id}`]: {
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
    before: { data: () => ({ examples: ['1', '2', '3', '4', '5'] }) },
    after: { data: () => ({ examples: ['5', '4', '2', '3', '1'] }) },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateExamples);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(db.batch().commit).not.toHaveBeenCalled();
  done();
});

test('remove data from deleted examples', async (done) => {
  spyOn(admin.firestore.FieldValue, 'delete').and.returnValue('removed');

  const changes = {
    before: { data: () => ({ examples: ['1', '2', '3', '4'] }) },
    after: { data: () => ({ examples: ['1', '3'] }), ref: 'removedRef' },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateExamples);
  const req = await wrapped(changes);
  const expected2 = { 'exampleData.2': 'removed' };
  const expected4 = { 'exampleData.4': 'removed' };

  expect(req).toBe('updated');
  expect(db.batch().update).toHaveBeenCalledWith('removedRef', expected2);
  expect(db.batch().update).toHaveBeenCalledWith('removedRef', expected4);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('update data for added examples', async (done) => {
  spyExample('3');
  spyExample('4');

  const changes = {
    before: { data: () => ({ examples: ['1', '2'] }) },
    after: { data: () => ({ examples: ['1', '3', '2', '4'] }), ref: 'added' },
  };
  const wrapped = testEnv.wrap(onUpdateChapterUpdateExamples);
  const req = await wrapped(changes);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('posts/3');
  expect(db.doc).toHaveBeenCalledWith('posts/4');
  expect(db.batch().update).toHaveBeenCalledWith('added', exampleData('3'));
  expect(db.batch().update).toHaveBeenCalledWith('added', exampleData('4'));
  done();
});
