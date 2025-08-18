import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.course.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      tokensSpent: true,
      pdfUrl: true,
      createdAt: true,
      options: true,
    },
  });

  // Приводим createdAt к ISO-строке (как ждёт Dashboard)
  const payload = items.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
  }));

  return NextResponse.json({ items: payload });
}
