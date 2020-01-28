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
  await admin.doc('replies/itemId').set({ content: 'new' });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('cannot update', async (done) => {
  const ref = db.doc('replies/itemId');
  await firebase.assertFails(ref.update({ content: 'new content' }));
  done();
});
