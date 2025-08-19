// app/contact/ContactForm.tsx
"use client";
import React from "react";
import { z } from "zod";
import { THEME } from "@/lib/theme";

const Schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Please provide a bit more detail"),
});

export default function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);

    const parsed = Schema.safeParse({ name, email, message });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          page: "contact",
        }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed to send");
      }

      setOk(true);
      setName(""); setEmail(""); setMessage("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit}>
      <div>
        <label className="block text-xs opacity-70 mb-1">Your name</label>
        <input
          className="w-full rounded-lg border px-3 py-2 bg-transparent"
          style={{ borderColor: THEME.cardBorder }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-xs opacity-70 mb-1">Email</label>
        <input
          type="email"
          className="w-full rounded-lg border px-3 py-2 bg-transparent"
          style={{ borderColor: THEME.cardBorder }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-xs opacity-70 mb-1">Message</label>
        <textarea
          className="w-full rounded-lg border px-3 py-2 bg-transparent min-h-[120px]"
          style={{ borderColor: THEME.cardBorder }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a bit about your question…"
          required
        />
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}
      {ok && <div className="text-xs text-green-400">Thanks! We’ll get back to you soon.</div>}

      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg px-4 py-2 font-semibold"
          style={{ background: THEME.accent, color: "#000" }}
        >
          {loading ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
