import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  // Неавторизованным просто возвращаем 0, чтобы хедер не падал
  if (!session?.user?.id) {
    return NextResponse.json({ balance: 0 });
  }

  const sum = await prisma.transaction.aggregate({
    where: { userId: session.user.id },
    _sum: { amount: true },
  });

  return NextResponse.json({ balance: sum._sum.amount ?? 0 });
}
