import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreateFollowerAddToUser } from '../addToUser';

test("add group to a user's groups", async (done) => {
  const group = {
    description: 'text',
    photo: 'group.png',
    title: 'name',
    updatedAt: 'today',
  };
  spyOn(db.doc(''), 'set').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({ data: () => group });

  const params = { groupId: 'itemId', userId: 'editorId' };
  const data = { joined: 'now' };
  const snap = { data: () => data };
  const wrapped = testEnv.wrap(onCreateFollowerAddToUser);
  const req = await wrapped(snap, { params });
  const payload = { ...group, id: 'itemId', joined: 'timestamp' };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/itemId');
  expect(db.doc).toHaveBeenCalledWith('users/editorId/groups/itemId');
  expect(db.doc('').set).toHaveBeenCalledWith(payload);
  done();
});
