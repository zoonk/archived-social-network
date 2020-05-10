import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();
const batch = db.batch();

import { onDeleteChapterUpdatePosts } from '../updatePosts';

test('remote chapter from posts', async (done) => {
  spyOn(batch, 'commit').and.returnValue('updated');
  when(db.doc as any)
    .calledWith('posts/ex1')
    .mockReturnValue('ex1Ref')
    .calledWith('posts/ex2')
    .mockReturnValue('ex2Ref')
    .calledWith('posts/les1')
    .mockReturnValue('les1Ref')
    .calledWith('posts/les2')
    .mockReturnValue('les2Ref');

  const data = { examples: ['ex1', 'ex2'], lessons: ['les1', 'les2'] };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onDeleteChapterUpdatePosts);
  const req = await wrapped(snap);
  const payload = { chapterId: null, chapterData: null };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('posts/ex1');
  expect(db.doc).toHaveBeenCalledWith('posts/ex2');
  expect(db.doc).toHaveBeenCalledWith('posts/les1');
  expect(db.doc).toHaveBeenCalledWith('posts/les2');
  expect(batch.update).toHaveBeenCalledWith('ex1Ref', payload);
  expect(batch.update).toHaveBeenCalledWith('ex2Ref', payload);
  expect(batch.update).toHaveBeenCalledWith('les1Ref', payload);
  expect(batch.update).toHaveBeenCalledWith('les2Ref', payload);
  done();
});
