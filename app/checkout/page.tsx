// app/checkout/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Plan = {
    name?: string;
    price?: number | string;
    currency?: string;
    tokens?: number;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    className?: string;
};

/* Theme-ish constants to match main page */
const BG_STYLE = `radial-gradient(60% 80% at 85% -10%, rgba(255,214,10,0.10) 0%, rgba(255,214,10,0.02) 40%, transparent 60%),
                  radial-gradient(60% 80% at 0% 100%, rgba(255,214,10,0.06) 0%, rgba(255,214,10,0.02) 30%, transparent 60%),
                  linear-gradient(180deg, #0E0E10 0%, #0E0E10 100%)`;
const ACCENT = "#FFD60A"; // bright yellow accent used on main
const CARD = "#0F1113"; // dark card background
const CARD_BORDER = "#1F2937"; // subtle border
const TEXT = "#E6E7E9"; // primary text for dark bg
const MUTED = "#9CA3AF"; // muted text

function Button({ children, className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center ${className}`}
        >
            {children}
        </button>
    );
}

function AccentButton({ children, className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-lg focus:outline-none ${className}`}
            style={{ backgroundColor: ACCENT, color: "black" }}
        >
            {children}
        </button>
    );
}

export default function CheckoutPage() {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("selectedPlan");
        if (stored) setPlan(JSON.parse(stored));
    }, []);

    if (!plan) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-screen px-4 py-12"
                style={{ background: BG_STYLE, color: TEXT }}
            >
                <h1 className="text-2xl font-semibold mb-4" style={{ color: TEXT }}>No plan selected</h1>
                <p className="text-sm mb-6" style={{ color: MUTED }}>Choose a plan from Pricing to continue.</p>
                <AccentButton onClick={() => (window.location.href = "/")} className="px-6 py-2">
                    Back to Pricing
                </AccentButton>
            </div>
        );
    }

    const formatPrice = (p?: number | string) =>
        p == null ? "—" : typeof p === "number" ? p.toFixed(2) : p;

    function validateInputs() {
        if (!fullName.trim()) return "Please enter your full name.";
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
        if (!cardNumber.replace(/\s/g, "") || cardNumber.replace(/\s/g, "").length < 12) return "Please enter a valid card number.";
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY format.";
        if (!cvc || !/^\d{3,4}$/.test(cvc)) return "CVC must be 3 or 4 digits.";
        return null;
    }

    async function handlePay() {
        setError(null);
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch("/api/armenotech/create-transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: plan.price,
                    email,
                    fullName,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Payment error");

            if (data.redirect) {
                window.location.href = data.redirect; // редірект на платіжну сторінку Armenotech
            } else {
                setError("No redirect URL received.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    }


    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{ background: BG_STYLE, color: TEXT }}
        >
            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="max-w-5xl w-full grid gap-8 md:grid-cols-2 items-start"
            >
                {/* Left: Payment form */}
                <div
                    className="rounded-2xl p-6 shadow-lg border"
                    style={{ backgroundColor: CARD, borderColor: CARD_BORDER, color: TEXT }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold" style={{ color: TEXT }}>Complete purchase</h2>
                            <p className="text-sm mt-1" style={{ color: MUTED }}>Secure checkout — enter your details below.</p>
                        </div>
                        <div className="text-right text-sm font-medium" style={{ color: "#10B981" }}>
                            {plan.currency} {formatPrice(plan.price)}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-medium" style={{ color: MUTED }}>Full name</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 bg-transparent focus:outline-none"
                            placeholder="Jane Doe"
                            style={{ borderColor: CARD_BORDER, color: TEXT }}
                        />

                        <label className="block text-xs font-medium" style={{ color: MUTED }}>Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 bg-transparent focus:outline-none"
                            placeholder="you@example.com"
                            type="email"
                            style={{ borderColor: CARD_BORDER, color: TEXT }}
                        />

                        <div className="grid grid-cols-1 gap-3">
                            <label className="block text-xs font-medium" style={{ color: MUTED }}>Card number</label>
                            <input
                                value={cardNumber}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^\d]/g, "").slice(0, 19);
                                    const spaced = v.match(/.{1,4}/g)?.join(" ") ?? v;
                                    setCardNumber(spaced);
                                }}
                                placeholder="4242 4242 4242 4242"
                                className="w-full rounded-lg border px-3 py-2 bg-transparent focus:outline-none"
                                inputMode="numeric"
                                style={{ borderColor: CARD_BORDER, color: TEXT }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium" style={{ color: MUTED }}>Expiry (MM/YY)</label>
                                <input
                                    value={expiry}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                                        if (raw.length >= 3) setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
                                        else setExpiry(raw);
                                    }}
                                    placeholder="MM/YY"
                                    className="w-full rounded-lg border px-3 py-2 bg-transparent focus:outline-none"
                                    style={{ borderColor: CARD_BORDER, color: TEXT }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium" style={{ color: MUTED }}>CVC</label>
                                <input
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                                    placeholder="123"
                                    className="w-full rounded-lg border px-3 py-2 bg-transparent focus:outline-none"
                                    inputMode="numeric"
                                    style={{ borderColor: CARD_BORDER, color: TEXT }}
                                />
                            </div>
                        </div>

                        {error && <div className="text-sm mt-1" style={{ color: "#F87171" }}>{error}</div>}
                        {success && <div className="text-sm mt-1" style={{ color: "#34D399" }}>{success}</div>}

                        <div className="pt-2">
                            <Button
                                onClick={handlePay}
                                disabled={processing}
                                className="w-full py-3 rounded-xl font-medium shadow-md"
                                aria-label="Complete payment"
                                style={{
                                    backgroundColor: ACCENT,
                                    color: "black",
                                    borderRadius: 12,
                                }}
                            >
                                {processing ? "Processing…" : `Pay ${plan.currency} ${formatPrice(plan.price)}`}
                            </Button>
                        </div>

                        <div className="mt-3 text-xs" style={{ color: MUTED }}>
                            By completing this purchase you agree to our Terms & Privacy.
                        </div>
                    </div>
                </div>

                {/* Right: Order summary */}
                <div
                    className="rounded-2xl p-6 shadow-sm border"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", borderColor: CARD_BORDER, color: TEXT }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold" style={{ color: TEXT }}>{plan.name}</h3>
                            <p className="text-sm mt-1" style={{ color: MUTED }}>{plan.tokens ? `${plan.tokens.toLocaleString()} tokens` : "Custom package"}</p>
                        </div>
                        <div className="text-lg font-bold" style={{ color: TEXT }}>
                            {plan.currency} {formatPrice(plan.price)}
                        </div>
                    </div>

                    <div className="rounded-lg bg-[#0B0C0D] border px-4 py-3 text-sm mb-4" style={{ borderColor: CARD_BORDER }}>
                        <div className="flex justify-between mb-2" style={{ color: MUTED }}>
                            <span>Tax</span>
                            <span>—</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium" style={{ color: TEXT }}>Total</span>
                            <span className="font-semibold" style={{ color: TEXT }}>{plan.currency} {formatPrice(plan.price)}</span>
                        </div>
                    </div>

                    <div className="text-sm mb-4" style={{ color: MUTED }}>
                        Secure payment. No stored card details — this demo simulates a gateway.
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-6 bg-gray-800 rounded-sm grid place-items-center text-xs font-semibold" style={{ color: MUTED }}>SSL</div>
                            <div className="text-sm" style={{ color: MUTED }}>Secure checkout</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-6 bg-gray-800 rounded-sm grid place-items-center text-xs font-semibold" style={{ color: MUTED }}>✓</div>
                            <div className="text-sm" style={{ color: MUTED }}>Instant token top-up</div>
                        </div>
                    </div>

                    <div className="mt-6 text-xs" style={{ color: MUTED }}>
                        Secured Payment
                    </div>
                </div>
            </motion.div>
        </div>
    );
}