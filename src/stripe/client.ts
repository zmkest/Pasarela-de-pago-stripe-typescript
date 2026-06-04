import Stripe from 'stripe';
import { env } from '../config/envs.js';

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY);

export { stripeClient };