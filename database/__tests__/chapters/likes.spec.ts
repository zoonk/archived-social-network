import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;
let collection: firebase.firestore.CollectionReference;
let doc: firebase.firestore.DocumentReference;

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  collection = db.collection('chapters/newItem/likes');
  doc = collection.doc('currentUser');
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('can create', async (done) => {
  await firebase.assertSucceeds(doc.set({ like: true }));
  done();
});

test('users can read their own data', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('cannot read data from other users', async (done) => {
  const ref = db.doc('chapters/newItem/likes/otherUser');
  await firebase.assertFails(ref.get());
  done();
});

test('users to update their own data', async (done) => {
  await firebase.assertSucceeds(doc.update({ like: false }));
  done();
});

test('cannot update data from other users', async (done) => {
  const ref = db.doc('chapters/newItem/likes/otherUser');
  await firebase.assertFails(ref.set({ like: true }));
  await admin.doc('chapters/newItem/likes/otherUser').set({ like: true });
  await firebase.assertFails(ref.update({ like: false }));
  done();
});

test('cannot delete data from other users', async (done) => {
  const ref = db.doc('chapters/newItem/likes/otherUser');
  await admin.doc('chapters/newItem/likes/otherUser').set({ like: true });
  await firebase.assertFails(ref.delete());
  done();
});

test('can allow users to delete their data', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('cannot list data', async (done) => {
  await firebase.assertFails(collection.get());
  done();
});
