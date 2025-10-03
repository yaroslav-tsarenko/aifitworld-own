// lib/stripe.ts - Client-side Stripe configuration
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}

export const stripePromise = loadStripe(publishableKey);

export const STRIPE_CONSTANTS = {
  SUCCESS_URL: '/dashboard?success=true',
  CANCEL_URL: '/dashboard?canceled=true',
} as const;
