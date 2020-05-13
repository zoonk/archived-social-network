import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;
let ref: firebase.firestore.DocumentReference;
const joined = firebase.firestore.FieldValue.serverTimestamp();
const profile = {
  name: 'leo',
  photo: 'pic.png',
  username: 'test',
  bio: 'test',
};
const data = { ...profile, joined, xp: 1 };

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'groupUser' });
  ref = db.doc('groups/groupId/followers/groupUser');
  await loadFirestoreRules();
  await admin.doc('profile/groupUser').set(profile);
  await admin.doc('profile/otherUser').set(profile);
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('can read', async (done) => {
  const docRef = db.doc('groups/groupId/followers/random');
  await firebase.assertSucceeds(docRef.get());
  done();
});

test('can list 20 users', async (done) => {
  const colRef = db.collection('groups/groupId/followers');
  await firebase.assertSucceeds(colRef.limit(20).get());
  done();
});

test('cannot list more than 20 users', async (done) => {
  const colRef = db.collection('groups/groupId/followers');
  await firebase.assertFails(colRef.limit(21).get());
  done();
});

test('users can join a group', async (done) => {
  await admin.doc('groups/groupId/followers/groupUser').delete();
  await firebase.assertSucceeds(ref.set(data));
  done();
});

test('cannot join a group using a fake UID', async (done) => {
  const docRef = db.doc('groups/groupId/followers/otherUser');
  await admin.doc('groups/groupId/followers/otherUser').delete();
  await firebase.assertFails(docRef.set(data));
  done();
});

test('users can leave a group', async (done) => {
  await firebase.assertSucceeds(ref.delete());
  done();
});

test('cannot leave a group using a fake UID', async (done) => {
  const docRef = db.doc('groups/groupId/followers/otherUser');
  await firebase.assertFails(docRef.delete());
  done();
});

test('cannot update', async (done) => {
  await admin.doc('groups/groupId/followers/groupUser').set(data);
  await firebase.assertFails(ref.update({ joined }));
  done();
});
