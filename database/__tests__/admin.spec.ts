import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;
let collection: firebase.firestore.CollectionReference;
let doc: firebase.firestore.DocumentReference;

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  collection = db.collection('admin');
  doc = collection.doc('stats');
  await loadFirestoreRules();
  await admin.doc('admin/stats').set({ posts: 10 });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot create an item', async (done) => {
  await firebase.assertFails(collection.add({ test: 'new item' }));
  done();
});

test('cannot update an item', async (done) => {
  await firebase.assertFails(doc.update({ test: 'updated item' }));
  done();
});

test('cannot delete an item', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('can read with admin access', async (done) => {
  const adminApp = initializeFbApp({ uid: 'adminUser' });
  const adminDoc = adminApp.doc('admin/stats');
  await admin.doc('users/adminUser').set({ role: 'admin' });
  await firebase.assertSucceeds(adminDoc.get());
  done();
});

test('cannot read with moderator access', async (done) => {
  const adminApp = initializeFbApp({ uid: 'modUser' });
  const adminDoc = adminApp.doc('admin/stats');
  await admin.doc('users/modUser').set({ role: 'moderator' });
  await firebase.assertFails(adminDoc.get());
  done();
});

test('cannot read with viewer access', async (done) => {
  const adminApp = initializeFbApp({ uid: 'viewerUser' });
  const adminDoc = adminApp.doc('admin/stats');
  await admin.doc('users/viewerUser').set({ role: 'viewer' });
  await firebase.assertFails(adminDoc.get());
  done();
});

test('cannot list items', async (done) => {
  await firebase.assertFails(collection.get());
  done();
});
