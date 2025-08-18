import React from "react";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-4">Terms of Service</h1>
      <p className="opacity-80 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="space-y-4 text-sm opacity-90">
        <p>These Terms govern your use of AIFitWorld. By using the app, you agree to these Terms.</p>
        <p>Training plans are for informational purposes only and are not medical advice.</p>
      </div>
    </main>
  );
}
