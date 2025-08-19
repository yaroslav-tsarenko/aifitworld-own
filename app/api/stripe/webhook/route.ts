import { NextResponse } from "next/server";
import { headers } from "next/headers";

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

    // Простой ответ для диагностики
    console.log("Webhook processed successfully");
    return NextResponse.json({ 
      received: true, 
      message: "Webhook received and processed",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("=== WEBHOOK ERROR ===", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


