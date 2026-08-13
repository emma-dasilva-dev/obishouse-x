"use client";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  return <section className="hero" id="event" aria-labelledby="hero-title">
    <Image className="hero-image" src="/images/hero/ctn-all-stars-hero.jpg" alt="CTN All Stars — soirée à Cotonou" fill priority sizes="100vw" />
    <div className="hero-shade" />
    <div className="hero-content">
      <p className="eyebrow">{t.hero.eyebrow}</p>
      <h1 id="hero-title"><span>{t.hero.titleTop}</span><strong>{t.hero.titleAccent}</strong></h1>
      <p className="hero-intro">{t.hero.intro}</p>
      <div className="hero-actions"><a className="button primary" href="#tickets">{t.hero.cta}<span>↗</span></a><a className="text-link" href="#experience">{t.hero.details} ↓</a></div>
    </div>
    <p className="hero-badge">{t.hero.badge}</p>
    <div className="hero-marquee" aria-hidden="true"><span>CTN ALL STARS · COTONOU · MADE IN BÉNIN · CTN ALL STARS · COTONOU · MADE IN BÉNIN · </span></div>
  </section>;
}

