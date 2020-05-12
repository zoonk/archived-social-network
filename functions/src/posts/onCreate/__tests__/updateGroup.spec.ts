import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onCreatePostUpdateGroup } from '../updateGroup';

test('return when there is no groupId', async (done) => {
  const data = { groupId: null };
  const snap = { data: () => data, ref: { update: jest.fn() } };
  const wrapped = testEnv.wrap(onCreatePostUpdateGroup);
  const req = await wrapped(snap);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  expect(snap.ref.update).not.toHaveBeenCalled();
  done();
});

test("update a group's data", async (done) => {
  const data = { groupId: 'groupId' };
  const groupData = { title: 'title', description: 'desc', photo: 'pic.png' };
  const snap = { data: () => data, ref: { update: jest.fn() } };

  spyOn(snap.ref, 'update').and.returnValue('updated');
  spyOn(db.doc(''), 'get').and.returnValue({ data: () => groupData });

  const wrapped = testEnv.wrap(onCreatePostUpdateGroup);
  const req = await wrapped(snap);
  const changes = {
    groupData: { ...groupData, id: 'groupId' },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId');
  expect(snap.ref.update).toHaveBeenCalledWith(changes);
  done();
});
