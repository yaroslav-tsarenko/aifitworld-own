import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe-server';
import { prisma } from '@/lib/db';

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

    // Calculate tokens based on currency and amount
    let tokens = 0;
    if (currency === 'gbp') {
      tokens = Math.floor(amount * 100); // £1 = 100 tokens
    } else if (currency === 'eur') {
      tokens = Math.floor(amount * 85); // €1 = 85 tokens
    } else if (currency === 'usd') {
      tokens = Math.floor(amount * 80); // $1 = 80 tokens
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName || `${tokens} Tokens`,
              description: `Token package for AIFitWorld`,
            },
            unit_amount: Math.floor(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${request.headers.get('origin')}/dashboard?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        tokens: tokens.toString(),
        currency: currency.toLowerCase(),
      },
    });

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
