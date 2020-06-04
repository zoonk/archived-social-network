import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { xpActions } from '../../../settings';

const testEnv = functions();
const db = admin.firestore();

import { onCreateTopicSetupFollowers } from '../setupFollowers';

test('add the topic author to the followers list', async (done) => {
  spyOn(db.doc(''), 'set').and.returnValue('updated');

  const profile = { name: 'name' };
  const data = { createdAt: 'now', createdBy: profile, createdById: 'userId' };
  const snap = { data: () => data, id: 'itemId' };
  const wrapped = testEnv.wrap(onCreateTopicSetupFollowers);
  const req = await wrapped(snap);
  const payload = { ...profile, joined: 'now', xp: xpActions.created_topics };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('topics/itemId/followers/userId');
  expect(db.doc('').set).toHaveBeenCalledWith(payload);
  done();
});
