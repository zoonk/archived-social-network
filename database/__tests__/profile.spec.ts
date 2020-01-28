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
  collection = db.collection('profile');
  doc = collection.doc('currentUser');
  await loadFirestoreRules();
  await admin.doc('profile/currentUser').set({ name: 'current' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot create', async (done) => {
  await firebase.assertFails(collection.add({ name: 'new user' }));
  done();
});

test('users can update their own data', async (done) => {
  await firebase.assertSucceeds(doc.update({ name: 'current user' }));
  done();
});

test('cannot update data from other users', async (done) => {
  const ref = db.doc('profile/otherUser');
  await admin.doc('profile/otherUser').set({ name: 'other' });
  await firebase.assertFails(ref.update({ name: 'changed' }));
  done();
});

// This is done in the backend.
test('cannot update the username field', async (done) => {
  await firebase.assertFails(doc.update({ username: 'new' }));
  done();
});

test('cannot delete', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('can read an item', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('can list one item', async (done) => {
  await firebase.assertSucceeds(collection.limit(1).get());
  done();
});

test('cannot list more than one item', async (done) => {
  await firebase.assertFails(collection.limit(2).get());
  done();
});
