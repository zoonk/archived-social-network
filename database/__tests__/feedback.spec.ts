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
  collection = db.collection('feedback');
  doc = collection.doc('123');
  await loadFirestoreRules();
  await admin.doc('feedback/123').set({ test: true });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('can read with admin access', async (done) => {
  await admin.doc('users/currentUser').set({ role: 'admin' });
  await firebase.assertSucceeds(doc.get());
  done();
});

test('cannot read without admin access', async (done) => {
  const app = initializeFbApp({ uid: 'nonAdminUser' });
  const ref = app.doc('feedback/123');
  await firebase.assertFails(ref.get());
  done();
});

test('authenticated users can leave a feedback', async (done) => {
  await firebase.assertSucceeds(collection.add({ uid: 'currentUser' }));
  done();
});

test('non authenticated users can leave a feedback', async (done) => {
  const nonAuth = initializeFbApp(undefined);
  const ref = nonAuth.collection('feedback');
  await firebase.assertSucceeds(ref.add({ name: 'test', comments: 'test' }));
  done();
});

test('fake users cannot leave a feedback', async (done) => {
  const ref = db.collection('feedback');
  await firebase.assertFails(ref.add({ uid: 'fakeUser' }));
  done();
});

test('cannot update a feedback', async (done) => {
  await firebase.assertFails(doc.update({ msg: 'new feedback' }));
  done();
});

test('cannot delete a feedback', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});
