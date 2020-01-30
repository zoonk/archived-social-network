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
  collection = db.collection('chapters/newItem/progress');
  doc = collection.doc('currentUser');
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot create', async (done) => {
  await firebase.assertFails(collection.add({ posts: 10 }));
  await firebase.assertFails(doc.set({ posts: 10 }));
  done();
});

test('cannot update', async (done) => {
  await admin.doc('chapters/newItem/progress/currentUser').set({ posts: 0 });
  await firebase.assertFails(doc.update({ posts: 10 }));
  done();
});

test('cannot delete', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('users can read their data', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('users cannot read data from others', async (done) => {
  const ref = db.doc('chapters/newItem/progress/otherUser');
  await firebase.assertFails(ref.get());
  done();
});

test('cannot list', async (done) => {
  await firebase.assertFails(collection.get());
  done();
});
