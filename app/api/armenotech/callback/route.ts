import crypto from "crypto";
import { NextResponse } from "next/server";

function md5(text: string) {
    return crypto.createHash("md5").update(text).digest("hex");
}

export async function POST(req: Request) {
    const payload = await req.json();

    // Валідація підпису (md5_body_sig)
    const sig = payload.md5_body_sig;
    const expected = md5(JSON.stringify(payload) + process.env.ARMENOTECH_CALLBACK_SECRET!);

    if (sig !== expected) {
        return NextResponse.json({ ok: false, reason: "invalid signature" }, { status: 400 });
    }

    // Далі можна зберегти статус у БД
    console.log("Callback received:", payload);

    return NextResponse.json({ ok: true });
}
