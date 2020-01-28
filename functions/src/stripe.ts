import { config } from 'firebase-functions';
import Stripe from 'stripe';

const secretKey = config().stripe.secret_key;

export const stripe = new Stripe(secretKey);
