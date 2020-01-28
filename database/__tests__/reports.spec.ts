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
  collection = db.collection('reports');
  doc = collection.doc('123');
  await loadFirestoreRules();
  await admin.doc('reports/123').set({ test: true });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('users read when they have admin access', async (done) => {
  await admin.doc('users/currentUser').set({ role: 'admin' });
  await firebase.assertSucceeds(doc.get());
  done();
});

test('users cannot read without admin access', async (done) => {
  const app = initializeFbApp({ uid: 'nonAdminUser' });
  const ref = app.doc('reports/123');
  await firebase.assertFails(ref.get());
  done();
});

test('non authenticated users can report an item', async (done) => {
  const nonAuth = initializeFbApp(undefined);
  const ref = nonAuth.collection('reports');
  await firebase.assertSucceeds(ref.add({ name: 'test', comments: 'test' }));
  done();
});

test('fake users cannot report an item', async (done) => {
  await firebase.assertFails(collection.add({ uid: 'fakeUser' }));
  done();
});

test('cannot update reports', async (done) => {
  await firebase.assertFails(doc.update({ msg: 'new reports' }));
  done();
});

test('cannot delete reports', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});
