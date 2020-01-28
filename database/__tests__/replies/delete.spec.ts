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
  db = initializeFbApp({ uid: 'currentUser' });
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('authors can delete their comments', async (done) => {
  const ref = db.doc('replies/deleteItem');
  await admin.doc('replies/deleteItem').set({ createdById: 'currentUser' });
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('users cannot delete comments from others', async (done) => {
  const ref = db.doc('replies/deleteItem');
  await admin.doc('replies/deleteItem').set({ createdById: 'otherUser' });
  await firebase.assertFails(ref.delete());
  done();
});
