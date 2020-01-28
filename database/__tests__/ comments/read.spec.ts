import * as firebase from '@firebase/testing';
import {
  initializeAdminApp,
  initializeFbApp,
  loadFirestoreRules,
  removeApps,
} from '../../helpers';

let admin: firebase.firestore.Firestore;

beforeAll(async (done) => {
  admin = initializeAdminApp();
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

describe('/comments - read', () => {
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

  it('should allow anonymous users to read items', async (done) => {
    const app = initializeFbApp(undefined);
    const ref = app.doc('comments/itemId');
    await firebase.assertSucceeds(ref.get());
    done();
  });

  it('should allow anonymous users to list items', async (done) => {
    const app = initializeFbApp(undefined);
    const ref = app.collection('comments');
    await firebase.assertSucceeds(ref.get());
    done();
  });
});
