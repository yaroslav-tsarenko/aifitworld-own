import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe-server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, region, source } = body;

    if (!amount || !region) {
      return NextResponse.json({ error: "Amount and region are required" }, { status: 400 });
    }

    // Определяем валюту и название продукта
    const currency = region === "UK" ? "gbp" : "eur";
    const productName = source === "custom" ? "Custom Token Pack" : `${source.charAt(0).toUpperCase() + source.slice(1)} Token Pack`;
    
    // Рассчитываем количество токенов (1 EUR/GBP = 100 токенов)
    const tokens = Math.round(amount * 100);

    // Создаем Stripe checkout сессию
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName,
              description: `${tokens.toLocaleString()} AI Fitness Tokens`,
            },
            unit_amount: Math.round(amount * 100), // Stripe использует центы
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/?canceled=true`,
      metadata: {
        userId: session.user.id,
        amount: amount.toString(),
        region: region,
        source: source || "custom",
        tokens: tokens.toString(),
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}


