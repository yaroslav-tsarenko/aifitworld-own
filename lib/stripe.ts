import { loadStripe } from '@stripe/stripe-js';

// Клиентская конфигурация Stripe
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Константы для продуктов (только для клиента)
export const STRIPE_PRODUCTS = {
  TOKEN_PACKAGES: {
    STARTER: {
      name: 'Starter Token Pack',
      price: 999, // $9.99
      tokens: 1000,
      stripePriceId: 'price_starter_tokens', // Замените на реальный ID
    },
    POPULAR: {
      name: 'Popular Token Pack',
      price: 1999, // $19.99
      tokens: 2500,
      stripePriceId: 'price_popular_tokens', // Замените на реальный ID
    },
    PRO: {
      name: 'Pro Token Pack',
      price: 3999, // $39.99
      tokens: 6000,
      stripePriceId: 'price_pro_tokens', // Замените на реальный ID
    },
    ENTERPRISE: {
      name: 'Enterprise Token Pack',
      price: 7999, // $79.99
      tokens: 15000,
      stripePriceId: 'price_enterprise_tokens', // Замените на реальный ID
    },
  },
};

// Типы для Stripe
export interface StripeProduct {
  name: string;
  price: number;
  tokens: number;
  stripePriceId: string;
}

export interface CreateCheckoutSessionData {
  productId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}


