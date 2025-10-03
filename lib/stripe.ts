// Client-side Stripe removed. Keep placeholder exports if any import lingers.
export const stripePromise = Promise.resolve(null);
export const STRIPE_CONSTANTS = {
  SUCCESS_URL: '/dashboard?success=true',
  CANCEL_URL: '/dashboard?canceled=true',
} as const;
