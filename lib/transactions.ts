import prisma from "@/lib/prisma";

export async function createTransactionAndAdjustBalance(userId: string, type: "topup" | "spend", amount: number, meta?: object) {
    // Use prisma.$transaction to ensure both ops succeed or fail together
    return await prisma.$transaction(async (tx) => {
        await tx.transaction.create({
            data: {
                userId,
                type,
                amount,
                meta: meta ? JSON.stringify(meta) : undefined,
            },
        });
        await tx.user.update({
            where: { id: userId },
            data: { tokens: { increment: type === "topup" ? amount : -amount } },
        });
    });
}
