import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'groupUser' });
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('viewers cannot delete', async (done) => {
  const ref = db.doc('groups/viewerDoc');
  await admin.doc('users/groupUser').set({ role: 'viewer' });
  await admin.doc('groups/viewerDoc').set({ updatedById: 'groupUser' });
  await firebase.assertFails(ref.delete());
  done();
});

test('authors can delete', async (done) => {
  const data = { createdById: 'groupUser', updatedById: 'groupUser' };
  const ref = db.doc('groups/authorDoc');
  await admin.doc('users/groupUser').set({ role: 'viewer' });
  await admin.doc('groups/authorDoc').set(data);
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('updatedById has the current user UID', async (done) => {
  const data = { createdById: 'groupUser', updatedById: 'otherUser' };
  const ref = db.doc('groups/otherUser');
  await admin.doc('users/groupUser').set({ role: 'viewer' });
  await admin.doc('groups/otherUser').set(data);
  await firebase.assertFails(ref.delete());
  done();
});

test('admins can delete', async (done) => {
  const ref = db.doc('groups/adminDoc');
  await admin.doc('users/groupUser').set({ role: 'admin' });
  await admin.doc('groups/adminDoc').set({ updatedById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('moderators can delete', async (done) => {
  const ref = db.doc('groups/moderatorDoc');
  await admin.doc('users/groupUser').set({ role: 'moderator' });
  await admin.doc('groups/moderatorDoc').set({ updatedById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});
