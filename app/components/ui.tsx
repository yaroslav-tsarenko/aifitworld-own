"use client";

import * as React from "react";
import { THEME } from "@/lib/theme";

/** маленький helper чтобы склеивать классы */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Карточка */
export function Card({
  className = "",
  children,
  interactive = false,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-2xl border p-5 md:p-6",
        interactive && "hover:shadow-lg hover:shadow-black/30 transition",
        className
      )}
      style={{ background: THEME.card, borderColor: THEME.cardBorder }}
    >
      {children}
    </div>
  );
}

/** Жёлтая основная кнопка */
export function AccentButton({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-[0_0_0_1px_rgba(0,0,0,0.6)]",
        className
      )}
      style={{ background: THEME.accent, color: "#0E0E10" }}
    >
      {children}
    </button>
  );
}

/** Прозрачная кнопка */
export function GhostButton({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border",
        className
      )}
      style={{ background: "transparent", color: THEME.text, borderColor: THEME.cardBorder }}
    >
      {children}
    </button>
  );
}
