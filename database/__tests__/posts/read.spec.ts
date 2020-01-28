import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  await loadFirestoreRules();
  await admin.doc('posts/itemId').set({ title: 'test' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('anonymous users can read an item', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.doc('posts/itemId');
  await firebase.assertSucceeds(ref.get());
  done();
});

test('anonymous users can list items', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.collection('posts').limit(50);
  await firebase.assertSucceeds(ref.get());
  done();
});

test('cannot list more than 50 items', async (done) => {
  const ref = db.collection('posts').limit(51);
  await firebase.assertFails(ref.get());
  done();
});
