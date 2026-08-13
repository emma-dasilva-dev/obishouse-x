"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const links = [
  ["event", "#event"],
  ["experience", "#experience"],
  ["tickets", "#tickets"],
] as const;

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  
  return (
    <header className="site-header">
      <a
        href="#top"
        className="brand-lockup"
        aria-label="CTN All Stars — accueil"
      >
        <Image
          src="/images/brand/ctn-vibe-logo.png"
          alt="CTN Vibe"
          width={60}
          height={60}
          priority
        />
        <span>CTN ALL STARS</span>
      </a>
      <nav className="desktop-nav" aria-label="Navigation principale">
        {links.map(([key, href]) => (
          <a key={key} href={href}>
            {t.nav[key]}
          </a>
        ))}
      </nav>
      <div className="desktop-actions">
        <LanguageSwitcher />
        <a className="nav-ticket" href="#tickets">
          {t.nav.tickets}
        </a>
      </div>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t.menu.open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        className={`mobile-menu ${open ? "open" : ""}`}
        id="mobile-menu"
        aria-hidden={!open}
      >
        <div className="mobile-menu-top">
          <span>CTN ALL STARS</span>
          <button
            ref={closeRef}
            type="button"
            aria-label={t.menu.close}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        <nav aria-label="Navigation mobile">
          {links.map(([key, href], index) => (
            <a key={key} href={href} onClick={() => setOpen(false)}>
              <small>0{index + 1}</small>
              {t.nav[key]}
            </a>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
