"use client";

import { THEME } from "@/lib/theme";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

function Card({ children, interactive = false }: { children: React.ReactNode; interactive?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 md:p-6 ${
        interactive ? "hover:shadow-lg hover:shadow-black/30 transition" : ""
      }`}
      style={{ background: THEME.card, borderColor: THEME.cardBorder }}
    >
      {children}
    </div>
  );
}

function GhostButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${className}`}
      style={{ borderColor: THEME.cardBorder, color: THEME.text }}
    >
      {children}
    </button>
  );
}

export default function BlogPage() {
  // Функции для хедера
  const handleOpenAuth = (mode: "signin" | "signup") => {
    console.log("Open auth:", mode);
  };

  const handleNavigate = (page: string) => {
    if (page === "home") {
      window.location.href = "/";
    } else {
      console.log("Navigate to:", page);
    }
  };

  return (
    <>
      <SiteHeader onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} />
      
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Blog</h1>
          <p className="text-lg opacity-80">Latest insights on fitness, AI training, and wellness.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} interactive>
              <div className="text-xs opacity-60">3–5 min read</div>
              <div className="mt-1 text-lg font-semibold">Knee-safe lower body session #{i}</div>
              <p className="mt-2 text-sm opacity-85">
                Practical tips and alternatives to keep your knees happy while training legs at home or in the gym.
              </p>
              <GhostButton className="mt-3">
                Read <ChevronRight size={16} />
              </GhostButton>
            </Card>
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
