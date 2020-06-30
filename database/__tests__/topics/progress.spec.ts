import * as firebase from '@firebase/testing';
import { initializeFbApp, loadFirestoreRules, removeApps } from '../../helpers';

let db: firebase.firestore.Firestore;
let collection: firebase.firestore.CollectionReference;
let doc: firebase.firestore.DocumentReference;

beforeAll(async (done) => {
  db = initializeFbApp({ uid: 'currentUser' });
  collection = db.collection('topics/newItem/progress');
  doc = collection.doc('currentUser');
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot create', async (done) => {
  await firebase.assertFails(doc.set({ examples: ['1'] }));
  done();
});

test('users can read their own data', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('cannot read data from other users', async (done) => {
  const ref = db.doc('topics/newItem/progress/otherUser');
  await firebase.assertFails(ref.get());
  done();
});

test('users cannot update their data', async (done) => {
  await firebase.assertFails(doc.update({ completed: false }));
  done();
});

test('cannot delete data', async (done) => {
  const ref = db.doc('topics/newItem/progress/currentUser');
  await firebase.assertFails(ref.delete());
  done();
});

test('cannot list data', async (done) => {
  await firebase.assertFails(collection.get());
  done();
});
