import * as firebase from '@firebase/testing';
import { initializeFbApp, loadFirestoreRules, removeApps } from '../../helpers';

let db: firebase.firestore.Firestore;

beforeAll(async (done) => {
  db = initializeFbApp(undefined);
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('can get a single item', async (done) => {
  const ref = db.doc('topics/physics');
  await firebase.assertSucceeds(ref.get());
  done();
});

test('can list items', async (done) => {
  const ref = db.collection('topics').limit(20);
  await firebase.assertSucceeds(ref.get());
  done();
});

test('cannot list more than 20 items', async (done) => {
  const ref = db.collection('topics').limit(21);
  await firebase.assertFails(ref.get());
  done();
});
