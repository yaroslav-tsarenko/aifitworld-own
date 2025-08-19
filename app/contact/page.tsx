"use client";

import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { THEME } from "@/lib/theme";
import { Building2, MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import * as React from "react";



export default function ContactPage() {
  // Состояние для валюты
  const [region, setRegion] = React.useState<"EU" | "UK">("EU");
  
  // Функции для хедера
  const handleOpenAuth = (mode: "signin" | "signup") => {
    // Здесь можно добавить логику для открытия модального окна
    console.log("Open auth:", mode);
  };

  const handleNavigate = (page: string) => {
    if (page === "home") {
      window.location.href = "/";
    } else {
      // Для других страниц можно добавить логику
      console.log("Navigate to:", page);
    }
  };

  return (
    <>
      <SiteHeader onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} region={region} setRegion={setRegion} />
      
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Contact Us
        </h1>
        <p className="mt-2 opacity-80">
          Questions, feedback, or partnership ideas? Send us a message — we usually reply within 1–2 business days.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Left: company info */}
          <section
            className="rounded-2xl border p-5 md:p-6"
            style={{ background: THEME.card, borderColor: THEME.cardBorder }}
          >
            <h2 className="text-xl font-semibold">Company</h2>

            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Building2 size={18} style={{ color: THEME.accent }} />
                <div>
                  <div className="font-medium">BREATHE FRESH LTD</div>
                  <div className="opacity-80">Company number 15954655</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={18} style={{ color: THEME.accent }} />
                <div className="opacity-90">
                  Dept 6157, 43 Owston Road, Carcroft, Doncaster, United Kingdom, DN6 8DA
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail size={18} style={{ color: THEME.accent }} />
                <Link href="mailto:info@aifitworld.co.uk" className="underline">
                  info@aifitworld.co.uk
                </Link>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={18} style={{ color: THEME.accent }} />
                <Link href="tel:+447418604319" className="underline">
                  +44 7418 604319
                </Link>
              </li>
            </ul>

            <div className="mt-6 text-xs opacity-70">
              Prefer email? Write to us directly and include any relevant screenshots or order IDs.
            </div>
          </section>

          {/* Right: contact form */}
          <section
            className="rounded-2xl border p-5 md:p-6"
            style={{ background: THEME.card, borderColor: THEME.cardBorder }}
          >
            <h2 className="text-xl font-semibold">Send a message</h2>
            <ContactForm />
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
