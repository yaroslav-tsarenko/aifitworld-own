import { NextResponse } from "next/server";

export async function GET() {
    const res = await fetch(
        `${process.env.ARMENOTECH_BASE_URL}/${process.env.ARMENOTECH_MERCHANT_GUID}/info`,
        {
            headers: {
                "X-App-Token": process.env.ARMENOTECH_APP_TOKEN!,
                "X-App-Secret": process.env.ARMENOTECH_APP_SECRET!,
            },
        }
    );

    const data = await res.json();
    return NextResponse.json(data);
}
