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
  collection = db.collection('topics/physics/leaderboard');
  doc = collection.doc('currentUser');
  await loadFirestoreRules();
  await admin.doc('topics/physics/leaderboard/currentUser').set({ xp: 10 });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot add a new user to the leaderboard', async (done) => {
  await firebase.assertFails(collection.add({ xp: 10 }));
  done();
});

test('cannot update the leaderboard', async (done) => {
  await firebase.assertFails(doc.update({ xp: 42 }));
  done();
});

test('cannot delete a user from the leaderboard', async (done) => {
  await firebase.assertFails(doc.delete());
  done();
});

test('can get a user from the leaderboard', async (done) => {
  const ref = db.doc('topics/physics/leaderboard/otherUser');
  await firebase.assertSucceeds(ref.get());
  done();
});

test('can list users from the leaderboard', async (done) => {
  const ref = collection.limit(20);
  await firebase.assertSucceeds(ref.get());
  done();
});

test('cannot list more than 20 users from the leaderboard', async (done) => {
  const ref = collection.limit(21);
  await firebase.assertFails(ref.get());
  done();
});
