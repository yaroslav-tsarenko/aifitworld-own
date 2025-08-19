import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

// Инициализируем Stripe с вашим секретным ключом
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil", // Используем актуальную версию API
});

// Получаем секрет вебхука из переменных окружения
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") as string;

    console.log("Body length:", body.length);
    console.log("Signature present:", !!signature);

    let event: Stripe.Event;

    try {
      // Проверяем, что запрос действительно пришел от Stripe
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Webhook signature verified successfully");
    } catch (err: any) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Если проверка прошла успешно, обрабатываем событие
    console.log(`✅ Webhook received and verified: ${event.id}, type: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("🎉 Checkout Session Completed!");
        console.log("Session ID:", session.id);
        console.log("User ID:", session.metadata?.userId);
        console.log("Tokens:", session.metadata?.tokens);
        console.log("Amount:", session.metadata?.amount);
        console.log("Region:", session.metadata?.region);

        try {
          // Получаем данные из метаданных
          const { userId, tokens, amount, region, source } = session.metadata || {};
          
          if (!userId || !tokens) {
            console.error("❌ Missing required metadata: userId or tokens");
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
          }

          const tokenAmount = parseInt(tokens);
          const paymentAmount = parseFloat(amount || "0");

          console.log("Processing payment:", {
            userId,
            tokenAmount,
            paymentAmount,
            region,
            source
          });

          // Создаем транзакцию пополнения в базе данных
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
                webhookId: event.id,
                processedAt: new Date().toISOString()
              }),
            },
          });

          console.log("✅ Transaction created successfully:", transaction.id);
          console.log(`🎯 Successfully processed payment for user ${userId}: ${tokenAmount} tokens (${paymentAmount} ${region === 'UK' ? 'GBP' : 'EUR'})`);

        } catch (error) {
          console.error("❌ Failed to process payment:", error);
          return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
        }
        break;

      case "payment_intent.succeeded":
        console.log("💳 Payment Intent succeeded:", event.data.object.id);
        break;

      case "payment_intent.payment_failed":
        console.log("❌ Payment Intent failed:", event.data.object.id);
        break;

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Отправляем Stripe ответ, что все прошло хорошо
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("=== WEBHOOK ERROR ===", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET метод для проверки, что эндпоинт работает
export async function GET() {
  return NextResponse.json({ 
    message: "Webhook endpoint is active. Please use POST for Stripe events.",
    timestamp: new Date().toISOString(),
    status: "ready"
  });
}