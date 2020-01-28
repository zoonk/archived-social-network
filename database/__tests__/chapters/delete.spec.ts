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
  db = initializeFbApp({ uid: 'chapterUser' });
  await loadFirestoreRules();
  done();
});

afterAll(async (done) => {
  await removeApps();
  done();
});

describe('/chapters - delete', () => {
  test('viewers cannot delete an item', async (done) => {
    const ref = db.doc('chapters/viewerDoc');
    await admin.doc('users/chapterUser').set({ role: 'viewer' });
    await admin.doc('chapters/viewerDoc').set({ updatedById: 'chapterUser' });
    await firebase.assertFails(ref.delete());
    done();
  });

  test('admins can delete items', async (done) => {
    const ref = db.doc('chapters/adminDoc');
    await admin.doc('users/chapterUser').set({ role: 'admin' });
    await admin.doc('chapters/adminDoc').set({ updatedById: 'otherUser' });
    await firebase.assertSucceeds(ref.delete());
    done();
  });

  test('moderators can delete items', async (done) => {
    const ref = db.doc('chapters/moderatorDoc');
    await admin.doc('users/chapterUser').set({ role: 'moderator' });
    await admin.doc('chapters/moderatorDoc').set({ updatedById: 'otherUser' });
    await firebase.assertSucceeds(ref.delete());
    done();
  });
});
