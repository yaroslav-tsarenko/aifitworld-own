"use client";

import React from "react";
import { GhostButton, AccentButton, Card } from "@/app/components/ui";

const STORAGE_KEY = "fa_cookie_consent_v1";

export default function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) setVisible(true);
    } catch {
      // если localStorage недоступен — просто не показываем
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div className="mx-auto max-w-6xl">
        <Card className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border"
              // Card уже тянет фон/бордер из THEME
        >
          <div className="text-sm opacity-85">
            We use cookies to improve your experience and analyze traffic. By clicking “Accept”, you agree to our use of cookies.
          </div>
          <div className="flex gap-2 shrink-0">
            <GhostButton onClick={() => (window.location.href = "/privacy")}>Privacy</GhostButton>
            <GhostButton onClick={() => (window.location.href = "/terms")}>Terms</GhostButton>
            <AccentButton onClick={accept}>Accept</AccentButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
