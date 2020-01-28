import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteNoteUpdateCount } from '../updateNotesCount';

test('increment the number of saved items', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const context = { params: { createdById: 'createdById' } };
  const wrapped = testEnv.wrap(onDeleteNoteUpdateCount);
  const req = await wrapped({}, context);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('users/createdById');
  expect(db.doc('').update).toHaveBeenCalledWith({ notes: -1 });
  done();
});
