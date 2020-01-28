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

const add = {
  category: 'posts',
  chapters: [],
  comments: 0,
  content: 'content',
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  createdBy: profile,
  createdById: 'currentUser',
  format: 'text',
  language: 'en',
  links: null,
  likes: 0,
  order: {},
  title: 'new name',
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
  ref = db.doc('posts/itemId');
  await loadFirestoreRules();
  await admin.doc('profile/currentUser').set(profile);
  await admin.doc('posts/itemId').set(add);
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('authenticated users can update', async (done) => {
  const changes = {
    ...edit,
    title: 'changed title',
  };
  await firebase.assertSucceeds(ref.update(changes));
  done();
});

test('anonymous users cannot update', async (done) => {
  const app = initializeFbApp(undefined);
  const appRef = app.doc('posts/itemId');
  await firebase.assertFails(appRef.update({ ...edit, updatedById: null }));
  done();
});

test('cannot update posts from other users whose format is text', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'posts',
    format: 'text',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertFails(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('can update examples', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'examples',
    format: 'text',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertSucceeds(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('can update lessons', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'lessons',
    format: 'text',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertSucceeds(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('can update posts from other users whose format is a link', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'posts',
    format: 'link',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertSucceeds(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('can update posts from other users whose format is a video', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'posts',
    format: 'video',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertSucceeds(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('cannot update questions from other users whose format is text', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'questions',
    format: 'text',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertFails(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('can update questions from other users whose format is link', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'questions',
    format: 'link',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertSucceeds(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('can update questions from other users whose format is video', async (done) => {
  const docRef = db.doc('posts/otherUser');
  const changes = {
    ...add,
    category: 'questions',
    format: 'video',
    createdById: 'otherUser',
  };
  await admin.doc('posts/otherUser').set(changes);
  await firebase.assertSucceeds(docRef.update({ ...edit, title: 'new' }));
  done();
});

test('category cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, category: 'examples' }));
  done();
});

test('chapters is an array', async (done) => {
  await firebase.assertSucceeds(
    ref.update({ ...edit, chapters: ['item1'], order: { item1: 1 } }),
  );
  await firebase.assertFails(
    ref.update({ ...edit, chapters: 'test', order: { test: 1 } }),
  );
  await firebase.assertFails(
    ref.update({ ...edit, chapters: 123, order: { 123: 1 } }),
  );
  await firebase.assertFails(
    ref.update({ ...edit, chapters: true, order: { true: 1 } }),
  );
  await firebase.assertFails(
    ref.update({ ...edit, chapters: { 1: true }, order: { 1: true } }),
  );
  await firebase.assertFails(
    ref.update({ ...edit, chapters: null, order: { null: 1 } }),
  );
  done();
});

test('comments cannot be changed', async (done) => {
  await firebase.assertFails(ref.update({ ...edit, comments: 1 }));
  done();
});

test('content is a string', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, content: 'test' }));
  await firebase.assertFails(ref.update({ ...edit, content: 123 }));
  await firebase.assertFails(ref.update({ ...edit, content: true }));
  await firebase.assertFails(ref.update({ ...edit, content: {} }));
  await firebase.assertFails(ref.update({ ...edit, content: ['test'] }));
  await firebase.assertFails(ref.update({ ...edit, content: null }));
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

test('format has a valid string', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, format: 'link' }));
  await firebase.assertSucceeds(ref.update({ ...edit, format: 'text' }));
  await firebase.assertSucceeds(ref.update({ ...edit, format: 'video' }));
  await firebase.assertFails(ref.update({ ...edit, format: 'other' }));
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

test('links is an array', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, links: [] }));
  await firebase.assertFails(ref.update({ ...edit, links: 'test' }));
  await firebase.assertFails(ref.update({ ...edit, links: 123 }));
  await firebase.assertFails(ref.update({ ...edit, links: true }));
  await firebase.assertFails(ref.update({ ...edit, links: { 1: true } }));
  done();
});

test('links is an array of strings', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, links: ['url'] }));
  await firebase.assertFails(ref.update({ ...edit, links: [true] }));
  await firebase.assertFails(ref.update({ ...edit, links: [123] }));
  await firebase.assertFails(ref.update({ ...edit, links: [null] }));
  await firebase.assertFails(ref.update({ ...edit, links: [{ 1: true }] }));
  done();
});

test('links can be null', async (done) => {
  await firebase.assertSucceeds(ref.update({ ...edit, links: null }));
  done();
});

test('order is a map', async (done) => {
  await firebase.assertSucceeds(
    ref.update({ ...edit, chapters: [], order: {} }),
  );
  await firebase.assertFails(ref.update({ ...edit, order: 'test' }));
  await firebase.assertFails(ref.update({ ...edit, order: 123 }));
  await firebase.assertFails(ref.update({ ...edit, order: true }));
  await firebase.assertFails(ref.update({ ...edit, order: [1, 2, 3] }));
  done();
});

test('order has all chapter keys', async (done) => {
  const data = { ...edit, chapters: ['item1', 'item2', 'item3'] };
  const valid = { ...data, order: { item1: 1, item2: 2, item3: 3 } };
  await firebase.assertSucceeds(ref.update(valid));
  await firebase.assertFails(ref.update({ ...data, order: {} }));
  await firebase.assertFails(ref.update({ ...data, order: { item1: 1 } }));
  done();
});

test('order is a number or empry', async (done) => {
  const data = { ...edit, chapters: ['item1'] };
  const valid = { ...data, order: { item1: 1 } };
  await firebase.assertSucceeds(ref.update(valid));
  await firebase.assertSucceeds(
    ref.update({ ...edit, chapters: [], order: {} }),
  );
  await firebase.assertFails(ref.update({ ...data, order: { item1: '1' } }));
  await firebase.assertFails(ref.update({ ...data, order: { item1: {} } }));
  await firebase.assertFails(ref.update({ ...data, order: { item1: [1] } }));
  await firebase.assertFails(ref.update({ ...data, order: { item1: true } }));
  await firebase.assertFails(ref.update({ ...data, order: { item1: null } }));
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
