import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, email, fullName, country = "GB" } = body;

        const transactionPayload = {
            amount: Number(amount),
            fields: {
                transaction: {
                    deposit_method: process.env.ARMENOTECH_METHOD_GUID,
                    deposit: {
                        redirect_url: process.env.ARMENOTECH_RETURN_URL,
                        fail_url: process.env.ARMENOTECH_FAIL_URL,
                        status_callback_url: process.env.ARMENOTECH_STATUS_CALLBACK_URL,
                        external_id: `order_${Date.now()}`,
                        from_email: email,
                        from_first_name: fullName.split(" ")[0],
                        from_last_name: fullName.split(" ")[1] || "",
                        from_country: country,
                        referer_domain: "afitworld.co.uk",
                        locale_lang: "en",
                    },
                },
            },
        };

        const res = await fetch(
            `${process.env.ARMENOTECH_BASE_URL}/${process.env.ARMENOTECH_MERCHANT_GUID}/transactions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Token": process.env.ARMENOTECH_APP_TOKEN!,
                    "X-App-Secret": process.env.ARMENOTECH_APP_SECRET!,
                },
                body: JSON.stringify(transactionPayload),
            }
        );

        const data = await res.json();
        if (!res.ok) return NextResponse.json(data, { status: res.status });

        // Повертаємо URL редіректу (data.how)
        return NextResponse.json({ redirect: data.how, id: data.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}
