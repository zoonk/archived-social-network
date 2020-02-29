import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;
let ref: firebase.firestore.CollectionReference;
const profile = {
  bio: 'bio',
  name: 'name',
  photo: 'user.png',
  username: 'username',
};

const data = {
  chapters: [],
  comments: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  createdBy: profile,
  createdById: 'currentUser',
  description: 'content',
  language: 'en',
  likes: 0,
  photo: null,
  posts: 0,
  title: 'name',
  topics: ['topicId'],
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedBy: profile,
  updatedById: 'currentUser',
};

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  ref = db.collection('topics');
  await loadFirestoreRules();
  await admin.doc('profile/currentUser').set(profile);
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('authenticated users can create', async (done) => {
  await firebase.assertSucceeds(ref.add(data));
  done();
});

test('anonymous users cannot create', async (done) => {
  const app = initializeFbApp(undefined);
  const newRef = app.collection('topics');
  await firebase.assertFails(newRef.add(data));
  done();
});

test('chapters is an array', async (done) => {
  await firebase.assertFails(ref.add({ ...data, chapters: 'test' }));
  await firebase.assertFails(ref.add({ ...data, chapters: 123 }));
  await firebase.assertFails(ref.add({ ...data, chapters: true }));
  await firebase.assertFails(ref.add({ ...data, chapters: { 1: true } }));
  await firebase.assertFails(ref.add({ ...data, chapters: null }));
  done();
});

test('comments is set to 0', async (done) => {
  await firebase.assertFails(ref.add({ ...data, comments: 1 }));
  done();
});

test('createdAt has a valid timestamp', async (done) => {
  await firebase.assertFails(ref.add({ ...data, createdAt: '1452-10-01' }));
  await firebase.assertFails(ref.add({ ...data, createdAt: new Date() }));
  done();
});

test('createdBy has a valid user bio', async (done) => {
  const createdBy = { ...profile, bio: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, createdBy }));
  done();
});

test('createdBy has a valid user name', async (done) => {
  const createdBy = { ...profile, name: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, createdBy }));
  done();
});

test('createdBy has a valid user photo', async (done) => {
  const createdBy = { ...profile, photo: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, createdBy }));
  done();
});

test('createdBy has a valid username', async (done) => {
  const createdBy = { ...profile, username: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, createdBy }));
  done();
});

test('createdById has the current user UID', async (done) => {
  await firebase.assertFails(ref.add({ ...data, createdById: 'other' }));
  done();
});

test('description is a string', async (done) => {
  await firebase.assertFails(ref.add({ ...data, description: 123 }));
  await firebase.assertFails(ref.add({ ...data, description: true }));
  await firebase.assertFails(ref.add({ ...data, description: { 1: true } }));
  await firebase.assertFails(ref.add({ ...data, description: ['test'] }));
  done();
});

test('language has a valid string', async (done) => {
  await firebase.assertSucceeds(ref.add({ ...data, language: 'pt' }));
  await firebase.assertFails(ref.add({ ...data, language: 'other' }));
  done();
});

test('likes is set to 0', async (done) => {
  await firebase.assertFails(ref.add({ ...data, likes: 1 }));
  done();
});

test('photo is a string', async (done) => {
  await firebase.assertSucceeds(ref.add({ ...data, photo: 'photo.svg' }));
  await firebase.assertFails(ref.add({ ...data, photo: 123 }));
  await firebase.assertFails(ref.add({ ...data, photo: true }));
  await firebase.assertFails(ref.add({ ...data, photo: { 1: true } }));
  await firebase.assertFails(ref.add({ ...data, photo: ['test'] }));
  done();
});

test('photo can be null', async (done) => {
  await firebase.assertSucceeds(ref.add({ ...data, photo: null }));
  done();
});

test('posts is set to 0', async (done) => {
  await firebase.assertFails(ref.add({ ...data, posts: 1 }));
  done();
});

test('title is a string', async (done) => {
  await firebase.assertFails(ref.add({ ...data, title: 123 }));
  await firebase.assertFails(ref.add({ ...data, title: true }));
  await firebase.assertFails(ref.add({ ...data, title: { 1: true } }));
  await firebase.assertFails(ref.add({ ...data, title: ['test'] }));
  done();
});

test('topics is an array', async (done) => {
  await firebase.assertFails(ref.add({ ...data, topics: 'test' }));
  await firebase.assertFails(ref.add({ ...data, topics: 123 }));
  await firebase.assertFails(ref.add({ ...data, topics: true }));
  await firebase.assertFails(ref.add({ ...data, topics: { 1: true } }));
  await firebase.assertFails(ref.add({ ...data, topics: null }));
  done();
});

test('topics is an array of strings', async (done) => {
  await firebase.assertFails(ref.add({ ...data, topics: [true] }));
  await firebase.assertFails(ref.add({ ...data, topics: [123] }));
  await firebase.assertFails(ref.add({ ...data, topics: [null] }));
  await firebase.assertFails(ref.add({ ...data, topics: [{ 1: true }] }));
  done();
});

test('updatedAt has a valid timestamp', async (done) => {
  await firebase.assertFails(ref.add({ ...data, updatedAt: '1452-10-01' }));
  await firebase.assertFails(ref.add({ ...data, updatedAt: new Date() }));
  done();
});

test('updatedBy has a valid user bio', async (done) => {
  const updatedBy = { ...profile, bio: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, updatedBy }));
  done();
});

test('updatedBy has a valid user name', async (done) => {
  const updatedBy = { ...profile, name: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, updatedBy }));
  done();
});

test('updatedBy has a valid user photo', async (done) => {
  const updatedBy = { ...profile, photo: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, updatedBy }));
  done();
});

test('updatedBy has a valid username', async (done) => {
  const updatedBy = { ...profile, username: 'invalid' };
  await firebase.assertFails(ref.add({ ...data, updatedBy }));
  done();
});

test('updatedById has the current user UID', async (done) => {
  await firebase.assertFails(ref.add({ ...data, updatedById: 'other' }));
  done();
});
