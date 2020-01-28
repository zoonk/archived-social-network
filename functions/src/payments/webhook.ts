import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { stripe } from '../stripe';

const { signing } = functions.config().stripe;
const db = admin.firestore();

export const paymenthook = functions.https.onRequest((req, res) => {
  const sig = req.headers['stripe-signature']!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, signing);
  } catch (err) {
    return res.status(400).send(err.message);
  }

  return db
    .collection('payments')
    .add(event)
    .then(() => res.status(200).send('ok!'))
    .catch((err) => res.status(500).send(err));
});
