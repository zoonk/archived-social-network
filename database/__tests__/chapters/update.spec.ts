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

// Initial data
const data = {
  comments: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  createdBy: profile,
  createdById: 'currentUser',
  description: 'description',
  examples: ['example1'],
  language: 'en',
  lessons: ['lesson1'],
  likes: 0,
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
  ref = db.doc('chapters/itemId');
  await loadFirestoreRules();
  await admin.doc('profile/currentUser').set(profile);
  await admin.doc('chapters/itemId').set(data);
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('authenticated users can update', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, title: 'new' }));
  done();
});

test('anonymous users cannot update', async (done) => {
  const app = initializeFbApp(undefined);
  const docRef = app.doc('chapters/itemId');
  await firebase.assertFails(docRef.update({ title: 'new' }));
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

test('description cannot have more than 1000 characters', async (done) => {
  const description = new Array(1001).fill('a').join('');
  await firebase.assertFails(ref.update({ ...edit, description }));
  done();
});

test('exampleData cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, exampleData: { 1: true } }));
  done();
});

test('examples is an array', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, examples: ['2'] }));
  await firebase.assertFails(ref.update({ ...edit, examples: 'test' }));
  await firebase.assertFails(ref.update({ ...edit, examples: 123 }));
  await firebase.assertFails(ref.update({ ...edit, examples: true }));
  await firebase.assertFails(ref.update({ ...edit, examples: { 1: true } }));
  await firebase.assertFails(ref.update({ ...edit, examples: null }));
  done();
});

test('cannot have more than 20 examples', async (done) => {
  const add = (n: number) => ({ ...data, examples: new Array(n).fill('post') });
  const doc = (id: string) => db.doc(`chapters/${id}`);
  const { arrayUnion } = firebase.firestore.FieldValue;
  const examples = arrayUnion('new');
  await admin.doc('chapters/1').set(add(19));
  await admin.doc('chapters/2').set(add(20));
  await firebase.assertSucceeds(doc('1').update({ ...edit, examples }));
  await firebase.assertFails(doc('2').update({ ...edit, examples }));
  done();
});

test('language cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, language: 'pt' }));
  done();
});

test('lessonData cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, lessonData: { 1: true } }));
  done();
});

test('lessons is an array', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, lessons: ['2'] }));
  await firebase.assertFails(ref.update({ ...edit, lessons: 'test' }));
  await firebase.assertFails(ref.update({ ...edit, lessons: 123 }));
  await firebase.assertFails(ref.update({ ...edit, lessons: true }));
  await firebase.assertFails(ref.update({ ...edit, lessons: { 1: true } }));
  await firebase.assertFails(ref.update({ ...edit, lessons: null }));
  done();
});

test('cannot have more than 20 lessons', async (done) => {
  const add = (n: number) => ({ ...data, lessons: new Array(n).fill('post') });
  const doc = (id: string) => db.doc(`chapters/${id}`);
  const { arrayUnion } = firebase.firestore.FieldValue;
  const lessons = arrayUnion('new');
  await admin.doc('chapters/1').set(add(19));
  await admin.doc('chapters/2').set(add(20));
  await firebase.assertSucceeds(doc('1').update({ ...edit, lessons }));
  await firebase.assertFails(doc('2').update({ ...edit, lessons }));
  done();
});

test('likes cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, likes: 1 }));
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
  await firebase.assertSucceeds(ref.update({ ...edit, topics: ['new'] }));
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
