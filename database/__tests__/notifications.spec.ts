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
  collection = db.collection('users/currentUser/notifications');
  doc = collection.doc('itemId');
  await loadFirestoreRules();
  await admin.doc('users/currentUser/notifications/itemId').set({ id: 'new' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('users can read their own notifications', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('users can list their own notifications', async (done) => {
  await firebase.assertSucceeds(collection.get());
  done();
});

test('cannot read notifications from other users', async (done) => {
  const ref = db.doc('users/otherUser/notifications/itemId');
  await firebase.assertFails(ref.get());
  done();
});

test('cannot list notifications from other users', async (done) => {
  const ref = db.collection('users/otherUser/notifications');
  await firebase.assertFails(ref.get());
  done();
});

test('cannot update a notification', async (done) => {
  await firebase.assertFails(doc.update({ title: 'new' }));
  done();
});

test('cannot delete a notification', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});
