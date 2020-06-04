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
const profile = {
  bio: 'bio',
  name: 'name',
  photo: 'user.png',
  username: 'username',
};

const data = {
  comments: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  createdBy: profile,
  createdById: 'currentUser',
  description: 'content',
  language: 'en',
  likes: 0,
  followers: 0,
  photo: null,
  pinned: ['1', '2', '3'],
  pinnedPosts: {},
  title: 'name',
  topics: ['topicId'],
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedBy: profile,
  updatedById: 'currentUser',
};

const edit = {
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedBy: profile,
  updatedById: 'currentUser',
};

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  ref = db.doc('groups/itemId');
  await loadFirestoreRules();
  await admin.doc('profile/currentUser').set(profile);
  await admin.doc('groups/itemId').set(data);
  await admin.doc('users/currentUser/groups/itemId').set({});
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('comments cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, comments: 1 }));
  done();
});

test('createdAt cannot be changed', async (done) => {
  const changes = {
    ...edit,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  await firebase.assertFails(ref.update(changes));
  done();
});

test('createdBy cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, createdBy: 'new' }));
  done();
});

test('createdById cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, createdById: 'other' }));
  done();
});

test('description is a string', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, description: 'k' }));
  await firebase.assertFails(ref.update({ ...edit, description: 123 }));
  await firebase.assertFails(ref.update({ ...edit, description: true }));
  await firebase.assertFails(ref.update({ ...edit, description: {} }));
  await firebase.assertFails(ref.update({ ...edit, description: ['test'] }));
  done();
});

test('description cannot have more than 1000 characters', async (done) => {
  const description = new Array(1001).fill('a').join('');
  await firebase.assertFails(ref.update({ ...edit, description }));
  done();
});

test('followers cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, followers: 1 }));
  done();
});

test('language cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, language: 'pt' }));
  done();
});

test('likes cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, likes: 1 }));
  done();
});

test('pinned items cannot be changed', async (done) => {
  const pinned = firebase.firestore.FieldValue.arrayUnion('new');
  await firebase.assertFails(ref.update({ ...edit, pinned }));
  done();
});

test('pinned order can change', async (done) => {
  const pinned = ['3', '1', '2'];
  await firebase.assertSucceeds(ref.update({ ...edit, pinned }));
  done();
});

test('pinnedPosts cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, pinnedPosts: { 1: 'ok' } }));
  done();
});

test('photo is a string', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, photo: 'photo.svg' }));
  await firebase.assertFails(ref.update({ ...edit, photo: 123 }));
  await firebase.assertFails(ref.update({ ...edit, photo: true }));
  await firebase.assertFails(ref.update({ ...edit, photo: { 1: true } }));
  await firebase.assertFails(ref.update({ ...edit, photo: ['test'] }));
  done();
});

test('photo can be null', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, photo: null }));
  done();
});

test('title is a string', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, title: 'new' }));
  await firebase.assertFails(ref.update({ ...edit, title: 123 }));
  await firebase.assertFails(ref.update({ ...edit, title: true }));
  await firebase.assertFails(ref.update({ ...edit, title: { 1: true } }));
  await firebase.assertFails(ref.update({ ...edit, title: ['test'] }));
  done();
});

test('topics is an array', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, topics: 'test' }));
  await firebase.assertFails(ref.update({ ...edit, topics: 123 }));
  await firebase.assertFails(ref.update({ ...edit, topics: true }));
  await firebase.assertFails(ref.update({ ...edit, topics: { 1: true } }));
  await firebase.assertFails(ref.update({ ...edit, topics: null }));
  done();
});

test('topics is an array of strings', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, topics: [true] }));
  await firebase.assertFails(ref.update({ ...edit, topics: [123] }));
  await firebase.assertFails(ref.update({ ...edit, topics: [null] }));
  await firebase.assertFails(ref.update({ ...edit, topics: [{ 1: true }] }));
  await firebase.assertSucceeds(ref.update({ ...edit, topics: ['ok'] }));
  done();
});

test('updatedAt has a valid timestamp', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, updatedAt: 'today' }));
  await firebase.assertFails(ref.update({ ...edit, updatedAt: new Date() }));
  done();
});

test('updatedBy has a valid user bio', async (done) => {
  const updatedBy = { ...profile, bio: 'invalid' };
  await firebase.assertFails(ref.update({ ...edit, updatedBy }));
  done();
});

test('updatedBy has a valid user name', async (done) => {
  const updatedBy = { ...profile, name: 'invalid' };
  await firebase.assertFails(ref.update({ ...edit, updatedBy }));
  done();
});

test('updatedBy has a valid user photo', async (done) => {
  const updatedBy = { ...profile, photo: 'invalid' };
  await firebase.assertFails(ref.update({ ...edit, updatedBy }));
  done();
});

test('updatedBy has a valid username', async (done) => {
  const updatedBy = { ...profile, username: 'invalid' };
  await firebase.assertFails(ref.update({ ...edit, updatedBy }));
  done();
});

test('updatedById has the current user UID', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, updatedById: 'other' }));
  done();
});
