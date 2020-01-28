import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
testEnv.mockConfig({ stripe: { signing: 'signature', secret_key: 'key' } });
const db = admin.firestore();

import { stripe } from '../../stripe';
import { paymenthook } from '../webhook';

test('do not add the payment when the identity is invalid', async (done) => {
  spyOn(stripe.webhooks, 'constructEvent').and.throwError('invalid');

  const req: any = {
    headers: { 'stripe-signature': 'signature' },
    body: {},
    rawBody: {},
  };

  const mockRes: any = {
    status: (code: number) => ({
      send: (message: string) => {
        expect(code).toBe(400);
        expect(message).toBe('invalid');
        expect(db.collection).not.toHaveBeenCalledWith('payments');
        done();
      },
    }),
  };

  paymenthook(req, mockRes);
  done();
});

test('add the payment to the database', async (done) => {
  const event = { test: 'ok' };
  spyOn(stripe.webhooks, 'constructEvent').and.returnValue(event);
  db.collection('').add = jest.fn().mockResolvedValue({});

  const req: any = {
    headers: { 'stripe-signature': 'signature' },
    body: {},
    rawBody: {},
  };

  const mockRes: any = {
    status: (code: number) => ({
      send: (message: string) => {
        expect(code).toBe(200);
        expect(message).toBe('ok!');
        expect(db.collection).toHaveBeenCalledWith('payments');
        expect(db.collection('').add).toHaveBeenCalledWith(event);
        done();
      },
    }),
  };

  paymenthook(req, mockRes);
});
