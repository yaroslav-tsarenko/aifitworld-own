import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { TOKEN_PACKAGES, TokenPackageId, getPackagePrice, Currency } from "@/lib/payment";

// Схема валидации для пополнения токенов
const TopupSchema = z.object({
  packageId: z.enum(['STARTER', 'POPULAR', 'PRO', 'ENTERPRISE'] as const),
  currency: z.enum(['EUR', 'GBP', 'USD']).default('GBP'),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { packageId, currency } = TopupSchema.parse(body);

    // Получаем данные пакета
    const tokenPackage = TOKEN_PACKAGES[packageId];
    if (!tokenPackage) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Создаем транзакцию пополнения
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "topup",
        amount: tokenPackage.tokens,
        meta: JSON.stringify({
          packageId,
          packageName: tokenPackage.name,
          price: getPackagePrice(packageId, currency as Currency),
          currency,
          tokensCredited: tokenPackage.tokens,
          processedAt: new Date().toISOString(),
          method: 'manual_admin', // Пока что ручное пополнение
        }),
      },
    });

    // Получаем новый баланс
    const balanceResult = await prisma.transaction.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true },
    });

    const newBalance = balanceResult._sum.amount ?? 0;

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      tokensAdded: tokenPackage.tokens,
      newBalance,
      package: {
        id: packageId,
        name: tokenPackage.name,
        price: getPackagePrice(packageId, currency as Currency),
        currency,
        tokens: tokenPackage.tokens,
      },
    });

  } catch (error) {
    console.error("Token topup error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process token topup" },
      { status: 500 }
    );
  }
}

// GET метод для получения доступных пакетов
export async function GET() {
  try {
    const packages = Object.entries(TOKEN_PACKAGES).map(([id, data]) => ({
      id: id as TokenPackageId,
      ...data,
    }));

    return NextResponse.json({
      packages,
      currencies: ['EUR', 'GBP', 'USD'],
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}