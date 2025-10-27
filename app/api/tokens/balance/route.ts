import { NextResponse } from "next/server";
import { getUserBalance } from "@/lib/balance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const balance = await getUserBalance(session.user.id);
        return NextResponse.json({ balance });
    } catch (err: unknown) {
        console.error("balance API error:", err);
        return NextResponse.json({ error: "Internal" }, { status: 500 });
    }
}
