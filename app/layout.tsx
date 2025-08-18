import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { THEME } from "@/lib/theme";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIFitWorld",
  description: "AI-powered fitness course generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          color: "#F4F4F5",
          // глобальный градиент для всех страниц (как на главной)
          background: `radial-gradient(60% 80% at 85% -10%, rgba(255,214,10,0.10) 0%, rgba(255,214,10,0.02) 40%, transparent 60%),
                       radial-gradient(60% 80% at 0% 100%, rgba(255,214,10,0.06) 0%, rgba(255,214,10,0.02) 30%, transparent 60%)`,
          backgroundColor: "#0E0E10",
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
