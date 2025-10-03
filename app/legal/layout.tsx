import { Metadata } from "next";
import LegalLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Legal — AIFitWorld",
  description: "Legal policies and terms for AIFitWorld",
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <LegalLayoutClient>{children}</LegalLayoutClient>;
}
