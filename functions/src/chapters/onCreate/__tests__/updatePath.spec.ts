import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateChapterUpdatePath } from '../updatePath';

test('update path data when a chapter is created', async (done) => {
  const snap = {
    ref: { update: jest.fn() },
    data: () => ({ pathId: 'path-id' }),
  };
  const data = {
    description: 'path description',
    photo: 'phot.png',
    title: 'path title',
  };

  spyOn(snap.ref, 'update').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({
    data: () => ({ ...data, likes: 10 }),
  });

  const wrapped = testEnv.wrap(onCreateChapterUpdatePath);
  const req = await wrapped(snap);
  const path = { ...data, id: 'path-id' };

  expect(req).toEqual('updated');
  expect(db.doc).toHaveBeenCalledWith('paths/path-id');
  expect(snap.ref.update).toHaveBeenCalledWith({ path });
  done();
});
