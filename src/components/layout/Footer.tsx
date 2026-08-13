"use client";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return <footer className="site-footer">
    <div><Image src="/images/brand/ctn-vibe-logo.png" alt="CTN Vibe" width={72} height={72} /></div>
    <p>{t.footer.line}</p><a href="#top">{t.footer.top}</a>
    <small>© 2026 CTN Vibe. {t.footer.rights}</small>
  </footer>;
}
