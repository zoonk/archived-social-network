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
  db = initializeFbApp({ uid: 'userTest' });
  collection = db.collection('users');
  doc = collection.doc('userTest');
  await loadFirestoreRules();
  await admin.doc('users/userTest').set({
    bio: 'current',
    role: 'viewer',
  });
  await admin.doc('users/otherUser').set({ bio: 'other' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('users can read their own data', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('users cannot read data from others', async (done) => {
  const ref = db.doc('users/otherUser');
  await firebase.assertFails(ref.get());
  done();
});

test('users can update their own data', async (done) => {
  await firebase.assertSucceeds(doc.update({ notifications: 0 }));
  done();
});

test('users cannot update data from others', async (done) => {
  const ref = db.doc('users/otherUser');
  await firebase.assertFails(ref.update({ notifications: 0 }));
  done();
});

test('cannot delete an item', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('cannot change the bio field', async (done) => {
  await firebase.assertFails(doc.update({ bio: 'my bio' }));
  done();
});

test('cannot change the name field', async (done) => {
  await firebase.assertFails(doc.update({ name: 'my name' }));
  done();
});

test('cannot change the photo field', async (done) => {
  await firebase.assertFails(doc.update({ photo: 'my photo' }));
  done();
});

test('cannot change the role field', async (done) => {
  await firebase.assertFails(doc.update({ role: 'moderator' }));
  await firebase.assertFails(doc.update({ role: 'admin' }));
  done();
});

test('cannot change the username field', async (done) => {
  await firebase.assertFails(doc.update({ username: 'new' }));
  done();
});
