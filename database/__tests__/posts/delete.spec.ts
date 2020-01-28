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
  db = initializeFbApp({ uid: 'exampleUser' });
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('viewers cannot delete an item', async (done) => {
  const ref = db.doc('posts/viewerDoc');
  await admin.doc('users/exampleUser').set({ role: 'viewer' });
  await admin.doc('posts/viewerDoc').set({ createdById: 'otherUser' });
  await firebase.assertFails(ref.delete());
  done();
});

test('admins can delete items', async (done) => {
  const ref = db.doc('posts/adminDoc');
  await admin.doc('users/exampleUser').set({ role: 'admin' });
  await admin.doc('posts/adminDoc').set({ createdById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('moderators can delete items', async (done) => {
  const ref = db.doc('posts/moderatorDoc');
  await admin.doc('users/exampleUser').set({ role: 'moderator' });
  await admin.doc('posts/moderatorDoc').set({ createdById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('authors can delete their content', async (done) => {
  const ref = db.doc('posts/authorDoc');
  await admin.doc('users/exampleUser').set({ role: 'viewer' });
  await admin.doc('posts/authorDoc').set({ createdById: 'exampleUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});
