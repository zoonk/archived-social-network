import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const auth = admin.auth();

import { onUpdateProfileUpdateSDK } from '../sdk';

test("send a request to update a user's profile and claims", async (done) => {
  spyOn(Promise, 'all').and.returnValue('updated');
  spyOn(auth, 'updateUser').and.returnValue('updateUser');
  spyOn(auth, 'setCustomUserClaims').and.returnValue('userClaims');

  const change = {
    after: {
      data: () => ({ name: 'user', photo: 'photo.png', username: 'test' }),
    },
  };
  const params = { id: 'userId' };

  const wrapped = testEnv.wrap(onUpdateProfileUpdateSDK);
  const req = await wrapped(change, { params });
  const user = { displayName: 'user', photoURL: 'photo.png' };
  const claims = { username: 'test' };

  expect(req).toBe('updated');
  expect(auth.updateUser).toHaveBeenCalledWith('userId', user);
  expect(auth.setCustomUserClaims).toHaveBeenCalledWith('userId', claims);
  expect(Promise.all).toHaveBeenCalledWith(['updateUser', 'userClaims']);
  done();
});
