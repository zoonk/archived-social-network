import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateActivityUpdateUserActions } from '../updateUserActions';

test('send a request to add an edit to the list of user actions', async (done) => {
  const data = {
    action: 'created',
    category: 'topic',
    createdById: 'editorId',
  };
  const snap = { data: () => data };
  const expected = {
    created_topic: 1,
  };

  spyOn(db.doc(''), 'set').and.returnValue(true);

  const wrapped = testEnv.wrap(onCreateActivityUpdateUserActions);
  const req = await wrapped(snap);

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('actions/editorId');
  expect(db.doc('').set).toHaveBeenCalledWith(expected, { merge: true });
  done();
});
