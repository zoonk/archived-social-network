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
  collection = db.collection('activity');
  doc = collection.doc('itemId');
  await loadFirestoreRules();
  await admin.doc('activity/itemId').set({ title: 'new activity' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot create a new activity', async (done) => {
  await firebase.assertFails(collection.add({ title: 'new item' }));
  done();
});

test('cannot update activity', async (done) => {
  await firebase.assertFails(doc.update({ title: 'updated!' }));
  done();
});

test('cannot delete an activity', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('cannot get an activity', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('can list activities', async (done) => {
  const ref = collection.limit(20);
  await firebase.assertSucceeds(ref.get());
  done();
});

test('cannot list more than 20 activities', async (done) => {
  const ref = collection.limit(21);
  await firebase.assertFails(ref.get());
  done();
});
