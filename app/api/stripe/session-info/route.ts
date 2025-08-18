import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe-server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Получаем информацию о сессии из Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Проверяем, что сессия принадлежит текущему пользователю
    if (checkoutSession.metadata?.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      session: checkoutSession,
    });

  } catch (error) {
    console.error("Failed to retrieve session info:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session info" },
      { status: 500 }
    );
  }
}
