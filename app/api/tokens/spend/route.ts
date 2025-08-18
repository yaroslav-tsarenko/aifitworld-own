import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

/**
 * Принимаем количество токенов к списанию (положительное число),
 * причину списания и произвольный meta-пэйлоад.
 */
const Body = z.object({
  tokens: z.number().int().positive().max(100_000), // например, 50, 1188 и т.д.
  reason: z.enum(["preview", "publish", "regen_day", "regen_week", "custom"]),
  meta: z.any().optional(), // любые данные, мы их просто сериализуем
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { tokens, reason, meta } = parsed.data;

  // пишем транзакцию как отрицательное значение (списание)
  const tx = await prisma.transaction.create({
    data: {
      userId: session.user.id,
      type: "spend",
      amount: -Math.abs(tokens),
      meta: JSON.stringify({ reason, ...(meta ?? {}) }),
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
  });
}
