// app/legal/privacy/page.tsx
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AIFitWorld",
  description: "Privacy policy and data handling practices for AIFitWorld",
};

const LAST_UPDATED = "2025-08-16";

// Малая локальная карточка, как в Terms/Refunds
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5 md:p-6"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      {/* бейдж */}
      <div
        className="text-xs inline-flex items-center gap-2 px-2.5 py-1 rounded-full border opacity-80"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        Policy
      </div>

      {/* заголовок и дата — как в других политиках */}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Privacy <span style={{ color: "#FFD60A" }}>Policy</span>
      </h1>
      <div className="text-sm opacity-70">Last updated: {LAST_UPDATED}</div>

      {/* Контент в таком же карточном виде */}
      <div className="grid gap-4 md:gap-5 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold mb-2">What we store</h3>
          <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
            <li>Account basics: email, auth/session data.</li>
            <li>Product data: token balance, transactions, generated content.</li>
            <li>No sale of personal data.</li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Why we store it</h3>
          <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
            <li>Operate the service (auth, balance, history, exports).</li>
            <li>Security, abuse prevention, and legal compliance.</li>
            <li>Basic analytics (see cookie banner).</li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Your controls</h3>
          <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
            <li>Request account deletion and data export.</li>
            <li>Cookie/banner controls where applicable.</li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Data sharing</h3>
          <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
            <li>No selling of personal data.</li>
            <li>Processors only to operate the product (hosting, DB, email).</li>
            <li>Disclosure if required by law.</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-2">Contact</h3>
        <p className="opacity-85 text-sm">
          For privacy requests (export/deletion), use the Feedback form in the homepage
          footer or contact our team. Include your account email to verify identity.
        </p>
      </Card>
    </div>
  );
}
