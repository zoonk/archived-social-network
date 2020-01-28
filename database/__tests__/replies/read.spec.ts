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
  await admin.doc('replies/itemId').set({ content: 'new' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('allow anonymous users to read an item', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.doc('replies/itemId');
  await firebase.assertSucceeds(ref.get());
  done();
});

test('allow anonymous users to list items', async (done) => {
  const app = initializeFbApp(undefined);
  const ref = app.collection('replies');
  await firebase.assertSucceeds(ref.get());
  done();
});
