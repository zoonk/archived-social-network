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
  collection = db.collection('users/currentUser/timeline');
  doc = collection.doc('itemId');
  await loadFirestoreRules();
  await admin.doc('users/currentUser/timeline/itemId').set({ id: 'new' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('users can read their own timeline', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('users can list their own timeline posts', async (done) => {
  await firebase.assertSucceeds(collection.get());
  done();
});

test('cannot read timeline posts from other users', async (done) => {
  const ref = db.doc('users/otherUser/timeline/itemId');
  await firebase.assertFails(ref.get());
  done();
});

test('cannot list timeline posts from other users', async (done) => {
  const ref = db.collection('users/otherUser/timeline');
  await firebase.assertFails(ref.get());
  done();
});

test('cannot update a timeline post', async (done) => {
  await firebase.assertFails(doc.update({ title: 'new' }));
  done();
});

test('cannot delete a timeline post', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});
