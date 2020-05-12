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

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  ref = db.collection('chapters');
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

describe('/chapters - create', () => {
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
    description: 'description',
    examples: [],
    language: 'en',
    lessons: [],
    likes: 0,
    title: 'name',
    topics: ['topicId'],
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedBy: profile,
    updatedById: 'currentUser',
  };

  beforeAll(async (done) => {
    const chapters = new Array(19).fill('id');
    await admin.doc('profile/currentUser').set(profile);
    await admin.doc('topics/topicId').set({ chapters });
    done();
  });

  test('authenticated users can create', async (done) => {
    await firebase.assertSucceeds(ref.add(data));
    done();
  });

  test('anonymous users cannot create', async (done) => {
    const app = initializeFbApp(undefined);
    const newRef = app.collection('chapters');
    await firebase.assertFails(newRef.add({ ...data, updatedById: null }));
    done();
  });

  test('cannot add more than 20 chapters', async (done) => {
    const add = { ...data, topics: ['full'] };
    const chapters = new Array(20).fill('chapterId');
    await admin.doc('topics/full').set({ chapters });
    await firebase.assertFails(ref.add(add));
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
    await firebase.assertFails(ref.add({ ...data, description: null }));
    done();
  });

  test('description cannot have more than 1000 characters', async (done) => {
    const description = new Array(1001).fill('a').join('');
    await firebase.assertFails(ref.add({ ...data, description }));
    done();
  });

  test('examples is an array', async (done) => {
    await firebase.assertFails(ref.add({ ...data, examples: 'test' }));
    await firebase.assertFails(ref.add({ ...data, examples: 123 }));
    await firebase.assertFails(ref.add({ ...data, examples: true }));
    await firebase.assertFails(ref.add({ ...data, examples: { 1: true } }));
    await firebase.assertFails(ref.add({ ...data, examples: null }));
    done();
  });

  test('cannot have more than 20 examples', async (done) => {
    await firebase.assertSucceeds(
      ref.add({ ...data, examples: new Array(20).fill('post') }),
    );
    await firebase.assertFails(
      ref.add({ ...data, examples: new Array(21).fill('post') }),
    );
    done();
  });

  test('language has a valid string', async (done) => {
    await firebase.assertSucceeds(ref.add({ ...data, language: 'pt' }));
    await firebase.assertFails(ref.add({ ...data, language: 'other' }));
    done();
  });

  test('lessons is an array', async (done) => {
    await firebase.assertFails(ref.add({ ...data, lessons: 'test' }));
    await firebase.assertFails(ref.add({ ...data, lessons: 123 }));
    await firebase.assertFails(ref.add({ ...data, lessons: true }));
    await firebase.assertFails(ref.add({ ...data, lessons: { 1: true } }));
    await firebase.assertFails(ref.add({ ...data, lessons: null }));
    done();
  });

  test('cannot have more than 20 lessons', async (done) => {
    await firebase.assertSucceeds(
      ref.add({ ...data, lessons: new Array(20).fill('post') }),
    );
    await firebase.assertFails(
      ref.add({ ...data, lessons: new Array(21).fill('post') }),
    );
    done();
  });

  test('likes is set to 0', async (done) => {
    await firebase.assertFails(ref.add({ ...data, likes: 1 }));
    done();
  });

  test('title is a string', async (done) => {
    await firebase.assertFails(ref.add({ ...data, title: 123 }));
    await firebase.assertFails(ref.add({ ...data, title: true }));
    await firebase.assertFails(ref.add({ ...data, title: { 1: true } }));
    await firebase.assertFails(ref.add({ ...data, title: ['test'] }));
    await firebase.assertFails(ref.add({ ...data, title: null }));
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
});
