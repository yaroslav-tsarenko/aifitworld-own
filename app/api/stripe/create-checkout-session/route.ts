import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe-server';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, currency = 'gbp', productName } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Normalize currency and calculate tokens
    const rawCurrency = (currency ?? 'gbp').toString().toLowerCase();
    const allowedCurrencies = ['gbp', 'eur', 'usd'] as const;
    const normalizedCurrency = (allowedCurrencies.includes(rawCurrency as any)
      ? (rawCurrency as typeof allowedCurrencies[number])
      : 'gbp') as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Currency;

    let tokens = 0;
    if (normalizedCurrency === 'gbp') {
      tokens = Math.floor(amount * 100); // £1 = 100 tokens
    } else if (normalizedCurrency === 'eur') {
      tokens = Math.floor(amount * 85); // €1 = 85 tokens
    } else if (normalizedCurrency === 'usd') {
      tokens = Math.floor(amount * 80); // $1 = 80 tokens
    }

    // Create Stripe checkout session (Stripe v2024-12-18 params)
    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.aifitworld.co.uk';
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: normalizedCurrency,
            product_data: {
              name: productName || `${tokens} Tokens`,
              description: `Token package for AIFitWorld`,
            },
            unit_amount: Math.floor(amount * 100), // Convert to minor units
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      customer_email: session.user.email ?? undefined,
      metadata: {
        userId: session.user.id,
        tokens: tokens.toString(),
        currency: normalizedCurrency,
      },
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    });

  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
