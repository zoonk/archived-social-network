import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;
let db: firebase.firestore.Firestore;

beforeAll(async (done) => {
  admin = initializeAdminApp();
  db = initializeFbApp({ uid: 'currentUser' });
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

describe('/comments - update', () => {
  const validCreate = {
    content: 'comment content',
    createdById: 'currentUser',
    postId: 'postId',
    topics: ['topicId'],
  };

  beforeAll(async (done) => {
    await admin.doc('comments/itemId').set(validCreate);
    done();
  });

  it('should not allow to update', async (done) => {
    const ref = db.doc('comments/itemId');
    await firebase.assertFails(ref.update({ content: 'new content' }));
    done();
  });
});
