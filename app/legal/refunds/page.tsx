import { THEME } from "@/lib/theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refunds & Tokens — AIFitWorld",
  description: "Refund policy and token system information for AIFitWorld",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: THEME.card, borderColor: THEME.cardBorder }}
    >
      {children}
    </div>
  );
}

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-8" style={{ color: THEME.text }}>
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1"
             style={{ background: "#19191f", border: `1px solid ${THEME.cardBorder}`, color: THEME.secondary }}>
          Policy
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          Refunds <span style={{ color: THEME.accent }}>& Tokens</span>
        </h1>
        <p className="opacity-80 text-sm">Last updated: 2025-08-16</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">How tokens work</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90 text-sm">
            <li>1 EUR/GBP = 100 tokens.</li>
            <li>You see estimated costs before generating (preview, course, PDF).</li>
            <li>Your balance and history are available in the Dashboard.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Refunds</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90 text-sm">
            <li>Unused token balances can be refunded on request.</li>
            <li>Spent tokens (for previews/courses/PDFs) are non-refundable.</li>
            <li>We may place temporary holds for fraud or chargeback reviews.</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="mt-2 opacity-90 text-sm">
          To request a refund of an unused balance, contact support via the Feedback form in the homepage footer
          or email our team. Include your account email and the top-up receipt ID (if available).
        </p>
      </Card>
    </main>
  );
}
