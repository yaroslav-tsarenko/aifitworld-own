import { THEME } from "@/lib/theme";
import Image from "next/image";

interface SiteFooterProps {
  onNavigate?: (page: string) => void;
}

export default function SiteFooter({ onNavigate }: SiteFooterProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  return (
    <footer
      className="border-t py-8 text-sm"
      style={{ borderColor: THEME.cardBorder }}
    >
      <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-5 text-center md:text-left">
        {/* 1. Логотип */}
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Image
              src="/images/logo.svg"
              alt="AIFitWorld Logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <div className="font-extrabold tracking-tight">
              AI<span style={{ color: THEME.accent }}>Fit</span>World
            </div>
          </div>
          <div className="opacity-80">© {new Date().getFullYear()} AIFitWorld.</div>
        </div>

        {/* 2. Реквизиты */}
        <div>
          <div className="font-semibold mb-2">Company</div>
          <div className="opacity-80 space-y-1">
            <div>BREATHE FRESH LTD</div>
            <div>Company number: 15954655</div>
            <div>12 King Street, Nottingham, England, NG1 2AS</div>
            <div>Email: <a href="mailto:info@aifitworld.co.uk" className="underline">info@aifitworld.co.uk</a></div>
            <div>Phone: +44 7418 604319</div>
          </div>
        </div>

        {/* 3. Полезные ссылки */}
        <div>
          <div className="font-semibold mb-2">Useful</div>
          <ul className="text-sm space-y-1 opacity-85">
            <li><a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="hover:opacity-100">Contact Us</a></li>
            <li><a href="/blog" onClick={(e) => { e.preventDefault(); handleNavigate('blog'); }} className="hover:opacity-100">Blog</a></li>
            <li><a href="/faq" onClick={(e) => { e.preventDefault(); handleNavigate('faq'); }} className="hover:opacity-100">FAQ</a></li>
          </ul>
        </div>

        {/* 4. Политики */}
        <div>
          <div className="font-semibold mb-2">Policies</div>
          <ul className="text-sm space-y-1 opacity-85">
            <li><a href="/legal/refunds" onClick={(e) => { e.preventDefault(); handleNavigate('legal/refunds'); }} className="hover:opacity-100">Refund & Returns Policy</a></li>
            <li><a href="/legal/privacy" onClick={(e) => { e.preventDefault(); handleNavigate('legal/privacy'); }} className="hover:opacity-100">Privacy Policy</a></li>
            <li><a href="/legal/terms" onClick={(e) => { e.preventDefault(); handleNavigate('legal/terms'); }} className="hover:opacity-100">Terms and Conditions</a></li>
            <li><a href="/legal/cookies" onClick={(e) => { e.preventDefault(); handleNavigate('legal/cookies'); }} className="hover:opacity-100">Cookies Policy</a></li>
          </ul>
        </div>

        {/* 5. Способы оплаты */}
        <div>
          <div className="font-semibold mb-2">Payment Methods</div>
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Image
                src="/images/visa-logo.svg"
                alt="Visa"
                width={48}
                height={24}
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Visa</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Image
                src="/images/mastercard-logo.svg"
                alt="Mastercard"
                width={48}
                height={24}
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
