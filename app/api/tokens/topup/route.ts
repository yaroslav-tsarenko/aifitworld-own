import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { TOKENS_PER_UNIT } from "@/lib/tokens";

// Формат А (как было раньше на бэке)
const BodyA = z.object({
  amount: z.number().positive(),                 // сумма денег в EUR/GBP (десятичная, без верхнего лимита)
  region: z.enum(["EU", "UK"]),                  // для валюты
  source: z.enum(["starter", "builder", "pro", "custom"]).optional(),
});

// Формат B (как шлёт фронт из Pricing по нашему плану)
const BodyB = z.object({
  amountCurrency: z.number().positive(),         // сумма денег (десятичная)
  currency: z.enum(["EUR", "GBP"]),
  source: z.enum(["starter", "builder", "pro", "custom"]).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Пробуем оба формата тела
  const parsedA = BodyA.safeParse(json);
  let amount: number;
  let region: "EU" | "UK";
  let source: "starter" | "builder" | "pro" | "custom";

  if (parsedA.success) {
    amount = parsedA.data.amount;
    region = parsedA.data.region;
    source = parsedA.data.source ?? "custom";
  } else {
    const parsedB = BodyB.safeParse(json);
    if (!parsedB.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    amount = parsedB.data.amountCurrency;
    region = parsedB.data.currency === "GBP" ? "UK" : "EU";
    source = parsedB.data.source ?? "custom";
  }

  // Нормализуем до двух знаков после запятой (12.345 -> 12.35)
  amount = Math.round(amount * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 422 });
  }

  // Пересчёт в токены
  const tokens = Math.round(amount * TOKENS_PER_UNIT);

  const metaObj = {
    money: amount,
    currency: region === "UK" ? "GBP" : "EUR",
    source,
    rate: TOKENS_PER_UNIT,
    tokensCredited: tokens,
  };

  const tx = await prisma.transaction.create({
    data: {
      userId: session.user.id,
      type: "topup",
      amount: tokens, // храним в токенах
      meta: JSON.stringify(metaObj),
    },
    select: { id: true, amount: true },
  });

  const sum = await prisma.transaction.aggregate({
    where: { userId: session.user.id },
    _sum: { amount: true },
  });

  return NextResponse.json({
    ok: true,
    txId: tx.id,
    balance: sum._sum.amount ?? 0,
    meta: metaObj,
  });
}
