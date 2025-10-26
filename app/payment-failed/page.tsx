"use client";
import Link from "next/link";

export default function PaymentFailedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-3xl font-bold text-red-500 mb-4">
                ❌ Payment Failed
            </h1>
            <p className="text-gray-300 mb-6">
                Unfortunately, your payment could not be processed.
                Please try again or use another card.
            </p>
            <Link href="/" className="text-yellow-400 underline">
                Back to Home
            </Link>
        </div>
    );
}
