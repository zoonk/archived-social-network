import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;
let collection: firebase.firestore.CollectionReference;
let doc: firebase.firestore.DocumentReference;

const valid = {
  categoryId: 'Physics',
  category: 'topics',
  description: 'note description',
  itemPath: 'topics/Physics',
  title: 'my note',
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
};

const user = { notes: 100, subscription: 'premium' };

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  collection = db.collection('users/currentUser/notes');
  doc = collection.doc('itemId');
  await loadFirestoreRules();
  await admin.doc('users/currentUser/notes/itemId').set(valid);
  await admin.doc('users/currentUser').set(user);
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('can create a new item', async (done) => {
  await firebase.assertSucceeds(collection.add(valid));
  done();
});

test('cannot add data to other users', async (done) => {
  const ref = db.collection('users/otherUser/notes');
  await firebase.assertFails(ref.add(valid));
  done();
});

test('cannot create if the categoryId is missing', async (done) => {
  const newData = { ...valid };
  delete newData.categoryId;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, categoryId: null }));
  done();
});

test('can create if the category is valid', async (done) => {
  await firebase.assertSucceeds(
    collection.add({ ...valid, category: 'chapters' }),
  );
  await firebase.assertSucceeds(
    collection.add({ ...valid, category: 'paths' }),
  );
  await firebase.assertSucceeds(
    collection.add({ ...valid, category: 'posts' }),
  );
  await firebase.assertSucceeds(
    collection.add({ ...valid, category: 'topics' }),
  );
  done();
});

test('cannot create if the category is not valid', async (done) => {
  const newData = { ...valid };
  delete newData.category;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, category: null }));
  await firebase.assertFails(
    collection.add({ ...newData, category: 'invalid' }),
  );
  done();
});

test('cannot create the path is missing', async (done) => {
  const newData = { ...valid };
  delete newData.itemPath;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, itemPath: null }));
  done();
});

test('cannot create if the updatedAt field is missing', async (done) => {
  const newData = { ...valid };
  delete newData.updatedAt;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, updatedAt: null }));
  done();
});

test('should allow to update items', async (done) => {
  const ref = db.doc('users/currentUser/notes/itemId');
  const data = {
    title: 'brand new title',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  await firebase.assertSucceeds(ref.update(data));
  done();
});

test('cannot update items from other users', async (done) => {
  const ref = db.doc('users/otherUser/notes/itemId');
  await firebase.assertFails(ref.set(valid));
  done();
});

test('cannot change the categoryId field', async (done) => {
  await firebase.assertFails(doc.update({ categoryId: 'newId' }));
  done();
});

test('cannot change the category field', async (done) => {
  await firebase.assertFails(doc.update({ category: 'paths' }));
  done();
});

test('cannot change the itemPath field', async (done) => {
  await firebase.assertFails(doc.update({ itemPath: 'new/path' }));
  done();
});

test('cannot update if the updatedAt field is missing', async (done) => {
  const newData = { ...valid };
  delete newData.updatedAt;
  await firebase.assertFails(doc.update(newData));
  await firebase.assertFails(doc.update({ updatedAt: null }));
  done();
});

test('users can list their own items', async (done) => {
  await firebase.assertSucceeds(collection.get());
  done();
});

test('cannot list items from other users', async (done) => {
  const ref = db.collection('users/otherUser/notes');
  await firebase.assertFails(ref.get());
  done();
});

test('should allow users to read their own data', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('cannot read data from other users', async (done) => {
  const ref = db.doc('users/otherUser/notes/itemId');
  await firebase.assertFails(ref.get());
  done();
});

test('can create unlimited items on premium subscription', async (done) => {
  const data = { notes: 100, subscription: 'premium' };
  await admin.doc('users/currentUser').set(data, { merge: true });
  await firebase.assertSucceeds(collection.add(valid));
  done();
});

test('cannot create more items than the free limit', async (done) => {
  const data = { notes: 20, subscription: 'free' };
  await admin.doc('users/currentUser').set(data, { merge: true });
  await firebase.assertFails(collection.add(valid));
  done();
});

test('cannot delete items from others users', async (done) => {
  const path = 'users/otherUser/notes/itemId';
  const ref = db.doc(path);
  await admin.doc(path).set(valid);
  await firebase.assertFails(ref.delete());
  done();
});

test('can delete items', async (done) => {
  await firebase.assertSucceeds(doc.delete());
  done();
});
