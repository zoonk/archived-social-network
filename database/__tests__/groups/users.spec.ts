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
  collection = db.collection('users/currentUser/groups');
  doc = collection.doc('itemId');
  await loadFirestoreRules();
  await admin.doc('users/currentUser/groups/itemId').set({});
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot add a new group', async (done) => {
  await firebase.assertFails(collection.add({ title: 'test' }));
  done();
});

test('cannot update groups', async (done) => {
  await firebase.assertFails(doc.update({ title: 'test' }));
  done();
});

test('cannot delete a group', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('users can read a group', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('users cannot read a group from another user', async (done) => {
  const ref = db.doc('users/other/groups/groupId');
  await firebase.assertFails(ref.get());
  done();
});

test('users can list their own groups', async (done) => {
  await firebase.assertSucceeds(collection.get());
  done();
});

test('cannot list groups from other users', async (done) => {
  const ref = db.collection('users/other/groups');
  await firebase.assertFails(ref.get());
  done();
});
