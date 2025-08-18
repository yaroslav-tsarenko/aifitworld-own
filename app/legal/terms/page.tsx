import { THEME } from "@/lib/theme";

export const metadata = { title: "Terms of Service — AIFitWorld" };

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

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-8" style={{ color: THEME.text }}>
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1"
             style={{ background: "#19191f", border: `1px solid ${THEME.cardBorder}`, color: THEME.secondary }}>
          Policy
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          Terms of <span style={{ color: THEME.accent }}>Service</span>
        </h1>
        <p className="opacity-80 text-sm">Last updated: 2025-08-16</p>
      </header>

      <Card>
        <h2 className="text-lg font-semibold">1. Service</h2>
        <p className="mt-2 opacity-90 text-sm">
          AIFitWorld provides informational fitness content (AI-generated with optional human review).
          It is not medical advice. Consult a healthcare professional before starting any program.
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">2. Accounts & eligibility</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90 text-sm">
            <li>Users must be 16+ (or as required in your jurisdiction).</li>
            <li>You’re responsible for account security and lawful use.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">3. Tokens & pricing</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90 text-sm">
            <li>Tokens are a virtual balance for features (previews/courses/PDFs).</li>
            <li>Pricing and features may change; we’ll keep costs transparent.</li>
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">4. Content & usage</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90 text-sm">
            <li>Don’t misuse or attempt to overburden the service.</li>
            <li>Generated content is for personal use; re-distribution may require permission.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">5. Changes & termination</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90 text-sm">
            <li>We may update features and these terms; continued use means acceptance.</li>
            <li>We may suspend accounts for abuse, fraud, or legal reasons.</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
