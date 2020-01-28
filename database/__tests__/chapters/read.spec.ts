import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;

beforeAll(async (done) => {
  admin = initializeAdminApp();
  await loadFirestoreRules();
  await admin.doc('chapters/itemId').set({ title: 'name' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('anonymous users can read an item', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.doc('chapters/itemId');
  await firebase.assertSucceeds(ref.get());
  done();
});

test('anonymous users can list items', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.collection('chapters');
  await firebase.assertSucceeds(ref.get());
  done();
});
