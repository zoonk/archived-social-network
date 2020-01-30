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

// Initial data.
const create = {
  chapters: 0,
  comments: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  createdBy: profile,
  createdById: 'currentUser',
  description: 'description',
  examples: 0,
  language: 'en',
  lessons: 0,
  level: 'beginner',
  likes: 0,
  photo: null,
  posts: 0,
  title: 'name',
  topics: ['topicId'],
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedBy: profile,
  updatedById: 'currentUser',
};

// Required fields for updating an item.
const edit = {
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedBy: profile,
  updatedById: 'currentUser',
};

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  ref = db.doc('paths/itemId');
  await loadFirestoreRules();
  await admin.doc('paths/itemId').set(create);
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('authenticated users can update', async (done) => {
  await firebase.assertSucceeds(ref.update(edit));
  done();
});

test('anonymous users cannot update', async (done) => {
  const app = initializeFbApp(undefined);
  const docRef = app.doc('paths/itemId');
  await firebase.assertFails(docRef.update({ ...edit, updatedById: null }));
  done();
});

test('chapters cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, chapters: 1 }));
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
  await firebase.assertFails(ref.update({ ...edit, description: 123 }));
  await firebase.assertFails(ref.update({ ...edit, description: true }));
  await firebase.assertFails(ref.update({ ...edit, description: {} }));
  await firebase.assertFails(ref.update({ ...edit, description: ['test'] }));
  await firebase.assertFails(ref.update({ ...edit, description: null }));
  done();
});

test('examples cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, examples: 1 }));
  done();
});

test('language cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, language: 'pt' }));
  done();
});

test('lessons cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, lessons: 1 }));
  done();
});

test('level has a valid string', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, level: 'advanced' }));
  await firebase.assertSucceeds(ref.update({ ...edit, level: 'pro' }));
  await firebase.assertSucceeds(ref.update({ ...edit, level: 'expert' }));
  await firebase.assertFails(ref.update({ ...edit, level: 'other' }));
  done();
});

test('likes cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, likes: 1 }));
  done();
});

test('photo is a string or null', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, photo: 123 }));
  await firebase.assertFails(ref.update({ ...edit, photo: true }));
  await firebase.assertFails(ref.update({ ...edit, photo: { 1: true } }));
  await firebase.assertFails(ref.update({ ...edit, photo: ['test'] }));
  await firebase.assertSucceeds(ref.update({ ...edit, photo: 'test.png' }));
  await firebase.assertSucceeds(ref.update({ ...edit, photo: null }));
  done();
});

test('posts cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, posts: 1 }));
  done();
});

test('title is a string', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, title: 123 }));
  await firebase.assertFails(ref.update({ ...edit, title: true }));
  await firebase.assertFails(ref.update({ ...edit, title: { 1: true } }));
  await firebase.assertFails(ref.update({ ...edit, title: ['test'] }));
  await firebase.assertFails(ref.update({ ...edit, title: null }));
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
