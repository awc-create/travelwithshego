// src/lib/stripe.ts
import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(secretKey, {
  // Let the Stripe SDK use its default apiVersion,
  // which matches the installed type (e.g. "2025-11-17.clover")
});
