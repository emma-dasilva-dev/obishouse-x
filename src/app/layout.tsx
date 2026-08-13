import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const display = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "CTN All Stars 2026 — Cotonou",
  description: "CTN Vibe × Obi’s House présentent CTN All Stars, le 20 août 2026 à Cotonou.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={`${display.variable} ${body.variable}`}><body><LanguageProvider>{children}</LanguageProvider></body></html>;
}

