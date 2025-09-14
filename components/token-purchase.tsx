'use client';

import React, { useState } from 'react';
import { STRIPE_PRODUCTS, StripeProduct } from '@/lib/stripe';
import { getStripe } from '@/lib/stripe';
import { THEME } from '@/lib/theme';

export default function TokenPurchase() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (product: StripeProduct) => {
    setLoading(product.stripePriceId);
    
    try {
      // Создаем checkout сессию
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.stripePriceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Перенаправляем на Stripe Checkout
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: url });
        if (error) {
          throw error;
        }
      } else {
        // Fallback - открываем URL напрямую
        window.location.href = url;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Failed to start purchase. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: THEME.text }}>
          Get More AI Fitness Tokens
        </h2>
        <p className="text-lg opacity-80" style={{ color: THEME.secondary }}>
          Choose a package and start creating amazing fitness programs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(STRIPE_PRODUCTS.TOKEN_PACKAGES).map(([key, product]) => (
          <div
            key={key}
            className="relative rounded-xl p-6 border transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: THEME.card,
              borderColor: THEME.cardBorder,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            {/* Популярный пакет */
            key === 'POPULAR' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2" style={{ color: THEME.text }}>
                {product.name}
              </h3>
              
              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: THEME.accent }}>
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="mb-6">
                <span className="text-2xl font-bold" style={{ color: THEME.text }}>
                  {product.tokens.toLocaleString()}
                </span>
                <span className="text-sm opacity-70" style={{ color: THEME.secondary }}>
                  {' '}tokens
                </span>
              </div>

              <button
                onClick={() => handlePurchase(product)}
                disabled={loading === product.stripePriceId}
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: THEME.accent,
                  color: 'white',
                }}
              >
                {loading === product.stripePriceId ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm opacity-70" style={{ color: THEME.secondary }}>
          Secure payment powered by Stripe • Tokens are added instantly after payment
        </p>
      </div>
    </div>
  );
}


