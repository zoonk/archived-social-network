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
  collection = db.collection('payments');
  doc = collection.doc('paymentId');
  await loadFirestoreRules();
  await admin.doc('actions/paymentId').set({ test: true });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot create', async (done) => {
  await firebase.assertFails(collection.add({ item: 'new' }));
  done();
});

test('cannot update', async (done) => {
  await firebase.assertFails(doc.update({ item: 'updated' }));
  done();
});

test('cannot delete', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('cannot read an item', async (done) => {
  await firebase.assertFails(doc.get());
  done();
});

test('cannot list tems', async (done) => {
  await firebase.assertFails(collection.get());
  done();
});
