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
  db = initializeFbApp({ uid: 'chapterUser' });
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('viewers cannot delete an item', async (done) => {
  const ref = db.doc('chapters/viewerDoc');
  await admin.doc('users/chapterUser').set({ role: 'viewer' });
  await admin.doc('chapters/viewerDoc').set({ updatedById: 'chapterUser' });
  await firebase.assertFails(ref.delete());
  done();
});

test('authors can delete a chapter', async (done) => {
  const data = { createdById: 'chapterUser', updatedById: 'chapterUser' };
  const ref = db.doc('chapters/authorDoc');
  await admin.doc('users/chapterUser').set({ role: 'viewer' });
  await admin.doc('chapters/authorDoc').set(data);
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('updatedById has the current user UID', async (done) => {
  const data = { createdById: 'chapterUser', updatedById: 'otherUser' };
  const ref = db.doc('chapters/otherUser');
  await admin.doc('users/chapterUser').set({ role: 'viewer' });
  await admin.doc('chapters/otherUser').set(data);
  await firebase.assertFails(ref.delete());
  done();
});

test('admins can delete items', async (done) => {
  const ref = db.doc('chapters/adminDoc');
  await admin.doc('users/chapterUser').set({ role: 'admin' });
  await admin.doc('chapters/adminDoc').set({ updatedById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('moderators can delete items', async (done) => {
  const ref = db.doc('chapters/moderatorDoc');
  await admin.doc('users/chapterUser').set({ role: 'moderator' });
  await admin.doc('chapters/moderatorDoc').set({ updatedById: 'otherUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});
