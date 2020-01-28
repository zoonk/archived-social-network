import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { StripeEvent } from './typings';

const db = admin.firestore();

export const updateSubscription = functions.firestore
  .document('payments/{id}')
  .onCreate((snap) => {
    const event = snap.data() as StripeEvent;
    const uid = event.data.object.client_reference_id;

    return db.doc(`users/${uid}`).update({
      subscription: 'premium',
      subscriptionStart: admin.firestore.FieldValue.serverTimestamp(),
      stripe: {
        customerId: event.data.object.customer,
        subscriptionId: event.data.object.subscription,
      },
    });
  });
