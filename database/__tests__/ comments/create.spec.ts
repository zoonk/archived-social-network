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

const topics = ['topicId'];

const data = {
  category: 'comments',
  commentId: null,
  content: 'some content',
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  createdBy: profile,
  createdById: 'currentUser',
  language: 'en',
  likes: 0,
  postId: 'postWithComments',
  replies: 0,
  topics,
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedBy: profile,
  updatedById: 'currentUser',
};

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  ref = db.collection('comments');
  await loadFirestoreRules();
  await admin.doc('profile/currentUser').set(profile);
  await admin.doc('posts/postWithComments').set({ topics });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('authenticated users can create items', async (done) => {
  await firebase.assertSucceeds(ref.add(data));
  done();
});

test('anonymous users cannot create items', async (done) => {
  const app = initializeFbApp(undefined);
  const appRef = app.collection('comments');
  await firebase.assertFails(appRef.add(data));
  done();
});

test('category field is a valid string', async (done) => {
  await firebase.assertSucceeds(ref.add({ ...data, category: 'comments' }));
  await firebase.assertSucceeds(
    ref.add({ ...data, category: 'replies', commentId: 'valid' }),
  );
  await firebase.assertFails(ref.add({ ...data, category: 'other' }));
  await firebase.assertFails(ref.add({ ...data, category: 123 }));
  await firebase.assertFails(ref.add({ ...data, category: true }));
  await firebase.assertFails(ref.add({ ...data, category: { test: true } }));
  await firebase.assertFails(ref.add({ ...data, category: ['comments'] }));
  await firebase.assertFails(ref.add({ ...data, category: null }));
  done();
});

test('reply has a commentId', async (done) => {
  await firebase.assertFails(
    ref.add({ ...data, category: 'replies', commentId: null }),
  );
  await firebase.assertSucceeds(
    ref.add({ ...data, category: 'replies', commentId: 'valid' }),
  );
  done();
});

test('content field is a string', async (done) => {
  await firebase.assertFails(ref.add({ ...data, content: 123 }));
  await firebase.assertFails(ref.add({ ...data, content: true }));
  await firebase.assertFails(ref.add({ ...data, content: { test: true } }));
  await firebase.assertFails(ref.add({ ...data, content: ['test'] }));
  await firebase.assertFails(ref.add({ ...data, content: null }));
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

test('language has a valid string', async (done) => {
  await firebase.assertSucceeds(ref.add({ ...data, language: 'pt' }));
  await firebase.assertFails(ref.add({ ...data, language: 'other' }));
  done();
});

test('likes is set to 0', async (done) => {
  await firebase.assertFails(ref.add({ ...data, likes: 1 }));
  done();
});

test('postId is a valid id', async (done) => {
  await firebase.assertFails(ref.add({ ...data, postId: 'invalid' }));
  done();
});

test('replies is set to 0', async (done) => {
  await firebase.assertFails(ref.add({ ...data, replies: 1 }));
  done();
});

test('topics are the same as those from the postId', async (done) => {
  await firebase.assertFails(ref.add({ ...data, topics: ['invalid'] }));
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
