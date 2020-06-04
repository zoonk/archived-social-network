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
  collection = db.collection('users/currentUser/topics');
  doc = collection.doc('itemId');
  await loadFirestoreRules();
  await admin.doc('users/currentUser/topics/itemId').set({});
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot add a new topic', async (done) => {
  await firebase.assertFails(collection.add({ title: 'test' }));
  done();
});

test('cannot update topics', async (done) => {
  await firebase.assertFails(doc.update({ title: 'test' }));
  done();
});

test('cannot delete a topic', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('users can read a topic', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('users cannot read a topic from another user', async (done) => {
  const ref = db.doc('users/other/topics/topicId');
  await firebase.assertFails(ref.get());
  done();
});

test('users can list their own topics', async (done) => {
  await firebase.assertSucceeds(collection.get());
  done();
});

test('cannot list topics from other users', async (done) => {
  const ref = db.collection('users/other/topics');
  await firebase.assertFails(ref.get());
  done();
});
