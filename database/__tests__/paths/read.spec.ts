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
  await admin.doc('paths/itemId').set({ title: 'name' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('anonymous users can read one item', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.doc('paths/itemId');
  await firebase.assertSucceeds(ref.get());
  done();
});

test('anonymous users can list items', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.collection('paths').limit(20);
  await firebase.assertSucceeds(ref.get());
  done();
});

test('no more than 20 items are displayed', async (done) => {
  const ref = db.collection('paths').limit(21);
  await firebase.assertFails(ref.get());
  done();
});
