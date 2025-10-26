import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Мапа токенів по планах
const TOKEN_MAP: Record<string, number> = {
    starter: 1000,
    builder: 2575,
    pro: 6600,
};

export async function POST(req: Request) {
    try {
        const { amount, currency, status, transaction_guid, userId, planName } = await req.json();

        if (status !== "success") {
            return NextResponse.json({ ok: false, reason: "payment_failed" }, { status: 400 });
        }

        // 1️⃣ Визначаємо кількість токенів
        const planKey = planName?.toLowerCase();
        let tokens = TOKEN_MAP[planKey] ?? 0;

        if (planKey === "custom") {
            // custom = 100 токенів за 1 GBP
            tokens = Math.round(Number(amount) * 100);
        }

        // 2️⃣ Знаходимо користувача
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 3️⃣ Створюємо транзакцію
        await prisma.transaction.create({
            data: {
                userId,
                type: "topup",
                amount: tokens,
                meta: JSON.stringify({
                    amount,
                    currency,
                    transaction_guid,
                    planName,
                }),
            },
        });

        // 4️⃣ Оновлюємо баланс користувача
        // (якщо ти зберігаєш баланс у окремому полі)
        // якщо ні — можеш розраховувати суму на фронті

        return NextResponse.json({
            ok: true,
            message: "Tokens added successfully",
            tokensAdded: tokens,
        });
    } catch (err) {
        console.error("Payment success handler error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
