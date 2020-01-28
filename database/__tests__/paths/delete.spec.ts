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
  db = initializeFbApp({ uid: 'pathUser' });
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('viewers cannot delete an item', async (done) => {
  const ref = db.doc('paths/viewerDoc');
  await admin.doc('users/pathUser').set({ role: 'viewer' });
  await admin.doc('paths/viewerDoc').set({ updatedById: 'pathUser' });
  await firebase.assertFails(ref.delete());
  done();
});

test('admins can delete items', async (done) => {
  const ref = db.doc('paths/adminDoc');
  await admin.doc('users/pathUser').set({ role: 'admin' });
  await admin.doc('paths/adminDoc').set({ updatedById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('moderators can delete items', async (done) => {
  const ref = db.doc('paths/moderatorDoc');
  await admin.doc('users/pathUser').set({ role: 'moderator' });
  await admin.doc('paths/moderatorDoc').set({ updatedById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});
