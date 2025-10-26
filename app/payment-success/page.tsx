"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
    const params = useSearchParams();
    const [planName, setPlanName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const amount = params.get("amount");
    const currency = params.get("currency");
    const transaction_guid = params.get("transaction_guid");

    // 👇 беремо status тільки для продакшну
    let status = params.get("status");

    // 🚀 якщо ти на localhost — примусово ставимо success
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        status = "success";
    }

    // ✅ localStorage доступний лише у браузері
    useEffect(() => {
        if (typeof window !== "undefined") {
            setPlanName(localStorage.getItem("selectedPlanName"));
            setUserId(localStorage.getItem("userId"));
        }
    }, []);

    // ✅ коли все готово — фіксуємо транзакцію
    useEffect(() => {
        if (
            status === "success" &&
            amount &&
            currency &&
            transaction_guid &&
            planName &&
            userId
        ) {
            fetch("/api/payment/success", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    currency,
                    status,
                    transaction_guid,
                    planName,
                    userId,
                }),
            })
                .then((r) => r.json())
                .then((data) => console.log("💰 Payment success:", data))
                .catch((err) => console.error("Payment success error:", err));
        }
    }, [status, amount, currency, transaction_guid, planName, userId]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
            <h1
                className={`text-3xl font-bold mb-4 ${
                    status === "success" ? "text-green-500" : "text-red-500"
                }`}
            >
                {status === "success"
                    ? "✅ Payment Successful!"
                    : "❌ Payment Failed"}
            </h1>

            <p className="text-gray-300 mb-6">
                {status === "success"
                    ? `Tokens have been added to your account.`
                    : "Payment could not be processed."}
            </p>

            <Link href="/" className="text-yellow-400 underline">
                Back to Home
            </Link>
        </div>
    );
}
