import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe-server";
import { prisma } from "@/lib/db";

// Временно отключаем webhook проверку для разработки
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Environment check:", {
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    });
    
    const headersList = await headers();
    console.log("Headers:", Object.fromEntries(headersList.entries()));
    
    const body = await req.text();
    console.log("Body length:", body.length);
    console.log("Body preview:", body.substring(0, 200));
    
    const signature = headersList.get("stripe-signature");
    console.log("Signature:", signature ? "Present" : "Missing");

  let event;

  // Проверяем webhook только если есть секрет
  if (webhookSecret && signature) {
    console.log("Using webhook secret verification");
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Webhook verified successfully");
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    console.log("Using development mode (no webhook secret)");
    // Для разработки без webhook секрета
    try {
      event = JSON.parse(body);
      console.log("Body parsed successfully");
    } catch (err) {
      console.error("Failed to parse webhook body:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  console.log("Webhook received:", { type: event.type, id: event.id });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { 
      id: string; 
      metadata: Record<string, string>;
      amount_total: number;
      currency: string;
    };
    console.log("Processing completed checkout session:", session);
    
    try {
      const { userId, tokens, amount, region, source } = session.metadata;
      const tokenAmount = parseInt(tokens);
      const paymentAmount = parseFloat(amount);

      console.log("Session metadata:", { userId, tokens, amount, region, source });

      // Создаем транзакцию пополнения
      const transaction = await prisma.transaction.create({
        data: {
          userId: userId,
          type: "topup",
          amount: tokenAmount,
          meta: JSON.stringify({
            reason: "stripe_payment",
            sessionId: session.id,
            stripeAmount: session.amount_total,
            currency: session.currency,
            userAmount: paymentAmount,
            region: region,
            source: source,
            tokensCredited: tokenAmount,
          }),
        },
      });

      console.log("Transaction created:", transaction);
      console.log(`Successfully processed payment for user ${userId}: ${tokenAmount} tokens (${paymentAmount} ${region === 'UK' ? 'GBP' : 'EUR'})`);
    } catch (error) {
      console.error("Failed to process successful payment:", error);
      return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
    }
  }

  // Обрабатываем другие типы событий для отладки
  if (event.type === "payment_intent.succeeded") {
    console.log("Payment intent succeeded:", event.data.object);
  } else if (event.type === "payment_intent.payment_failed") {
    console.log("Payment intent failed:", event.data.object);
  }

  return NextResponse.json({ received: true });
  } catch (error) {
    console.error("=== WEBHOOK ERROR ===", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


