import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;
const validCreate = {
  content: 'comment content',
  createdById: 'currentUser',
  postId: 'postId',
  topics: ['topicId'],
};

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  await loadFirestoreRules();
  await admin.doc('comments/itemId').set(validCreate);
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('authors can delete their comments', async (done) => {
  const ref = db.doc('comments/deleteItem');
  await admin.doc('comments/deleteItem').set(validCreate);
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('cannot delete comments from other users', async (done) => {
  const app = initializeFbApp({ uid: 'otherUser' });
  const ref = app.doc('comments/itemId');
  await firebase.assertFails(ref.delete());
  done();
});

test('moderators can delete comments from other users', async (done) => {
  const app = initializeFbApp({ uid: 'modUser' });
  const ref = app.doc('comments/itemId');
  await admin.doc('users/modUser').set({ role: 'moderator' });
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('admins can delete comments from other users', async (done) => {
  const app = initializeFbApp({ uid: 'adminUser' });
  const ref = app.doc('comments/itemId');
  await admin.doc('users/adminUser').set({ role: 'admin' });
  await firebase.assertSucceeds(ref.delete());
  done();
});
