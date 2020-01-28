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
  collection = db.collection('actions');
  doc = collection.doc('currentUser');
  await loadFirestoreRules();
  await admin.doc('actions/currentUser').set({ new_action: 'action id' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot create an action', async (done) => {
  await firebase.assertFails(collection.add({ action: 'new action' }));
  done();
});

test('cannot update an action', async (done) => {
  await firebase.assertFails(doc.update({ action: 'updated action' }));
  done();
});

test('cannot delete an action', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('cannot get an action', async (done) => {
  await firebase.assertFails(doc.get());
  done();
});

test('cannot list actions', async (done) => {
  await firebase.assertFails(collection.get());
  done();
});
