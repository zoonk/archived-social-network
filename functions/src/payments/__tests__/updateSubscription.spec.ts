import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { updateSubscription } from '../updateSubscription';

test("update a user's subscription", async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const snap = {
    data: () => ({
      data: {
        object: {
          client_reference_id: 'userId',
          customer: 'customerId',
          subscription: 'subscriptionId',
        },
      },
    }),
  };
  const expected = {
    subscription: 'premium',
    subscriptionStart: 'timestamp',
    stripe: {
      customerId: 'customerId',
      subscriptionId: 'subscriptionId',
    },
  };
  const wrapped = testEnv.wrap(updateSubscription);
  const req = await wrapped(snap);

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('users/userId');
  expect(db.doc('').update).toHaveBeenCalledWith(expected);
  done();
});
