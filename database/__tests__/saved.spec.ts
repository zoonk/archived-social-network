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

const validItem = {
  categoryId: 'Physics',
  category: 'topics',
  itemPath: 'topics/Physics',
  title: 'Physics',
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
};

const user = { saved: 100, subscription: 'premium' };

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  collection = db.collection('users/currentUser/saved');
  doc = collection.doc('itemId');
  await loadFirestoreRules();
  await admin.doc('users/currentUser/saved/itemId').set(validItem);
  await admin.doc('users/currentUser').set(user, { merge: true });
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

test('can create', async (done) => {
  await firebase.assertSucceeds(collection.add(validItem));
  done();
});

test('cannot add data to other users', async (done) => {
  const ref = db.collection('users/otherUser/saved');
  await firebase.assertFails(ref.add(validItem));
  done();
});

test('cannot create if the categoryId is missing', async (done) => {
  const newData = { ...validItem };
  delete newData.categoryId;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, categoryId: null }));
  done();
});

test('cannot create if the category is not valid', async (done) => {
  const newData = { ...validItem };
  delete newData.category;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, category: null }));
  await firebase.assertFails(collection.add({ ...newData, category: '123' }));
  done();
});

test('cannot create if the path is missing', async (done) => {
  const newData = { ...validItem };
  delete newData.itemPath;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, itemPath: null }));
  done();
});

test('cannot create if the title is missing', async (done) => {
  const newData = { ...validItem };
  delete newData.title;
  await firebase.assertFails(collection.add(newData));
  await firebase.assertFails(collection.add({ ...newData, title: null }));
  done();
});

test('cannot update items', async (done) => {
  await firebase.assertFails(doc.update(validItem));
  done();
});

test('users can list their items', async (done) => {
  await firebase.assertSucceeds(collection.get());
  done();
});

test('cannot list items from other users', async (done) => {
  const ref = db.collection('users/otherUser/saved');
  await firebase.assertFails(ref.get());
  done();
});

test('users can read their own data', async (done) => {
  await firebase.assertSucceeds(doc.get());
  done();
});

test('cannot read data from other users', async (done) => {
  const ref = db.doc('users/otherUser/saved/itemId');
  await firebase.assertFails(ref.get());
  done();
});

test('cannot delete items from other users', async (done) => {
  const ref = db.doc('users/otherUser/saved/itemId');
  await admin.doc('users/otherUser/saved/itemId').set(validItem);
  await firebase.assertFails(ref.delete());
  done();
});

test('users can delete their own items', async (done) => {
  await firebase.assertSucceeds(doc.delete());
  done();
});

test('can unlimited items on premium subscription', async (done) => {
  const data = { saved: 100, subscription: 'premium' };
  await admin.doc('users/currentUser').set(data, { merge: true });
  await firebase.assertSucceeds(collection.add(validItem));
  done();
});

test('cannot create more items than the free limit', async (done) => {
  const data = { saved: 20, subscription: 'free' };
  await admin.doc('users/currentUser').set(data, { merge: true });
  await firebase.assertFails(collection.add(validItem));
  done();
});
