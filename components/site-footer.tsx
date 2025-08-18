import Link from "next/link";
import { THEME } from "@/lib/theme";

export default function SiteFooter() {
  return (
    <footer
      className="border-t py-8 text-sm"
      style={{ borderColor: THEME.cardBorder }}
    >
      <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-5">
        {/* 1. Логотип */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo.svg" 
              alt="AIFitWorld Logo" 
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
            <div>Dept 6157 43 Owston Road, Carcroft, Doncaster,<br/> United Kingdom, DN6 8DA</div>
            <div>Email: <a href="mailto:info@aifitworld.co.uk" className="underline">info@aifitworld.co.uk</a></div>
            <div>Phone: +44 20 0000 0000</div>
          </div>
        </div>

        {/* 3. Полезные ссылки */}
        <div>
          <div className="font-semibold mb-2">Useful</div>
          <ul className="text-sm space-y-1 opacity-85">
            <li><Link href="/contact" className="hover:opacity-100">Contact Us</Link></li>
            <li><Link href="/blog" className="hover:opacity-100">Blog</Link></li>
            <li><Link href="/faq" className="hover:opacity-100">FAQ</Link></li>
          </ul>
        </div>

        {/* 4. Политики */}
        <div>
          <div className="font-semibold mb-2">Policies</div>
          <ul className="text-sm space-y-1 opacity-85">
            <li><Link href="/legal/refunds" className="hover:opacity-100">Refunds & Tokens</Link></li>
            <li><Link href="/legal/privacy" className="hover:opacity-100">Privacy Policy</Link></li>
            <li><Link href="/legal/terms" className="hover:opacity-100">Terms of Service</Link></li>
          </ul>
        </div>

        {/* 5. Способы оплаты */}
        <div>
          <div className="font-semibold mb-2">Payment Methods</div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img 
                src="/images/visa-logo.svg" 
                alt="Visa" 
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Visa</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="/images/mastercard-logo.svg" 
                alt="Mastercard" 
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Mastercard</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="/images/Maestro_Logo.svg" 
                alt="Maestro" 
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Maestro</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="/images/American_Express_logo.svg" 
                alt="American Express" 
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Amex</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="/images/Apple_Pay_logo.svg" 
                alt="Apple Pay" 
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Apple Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="/images/Google_Pay_Logo.svg" 
                alt="Google Pay" 
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs opacity-70">Google Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
