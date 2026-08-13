"use client";
import Image from "next/image";
import { partners } from "@/data/partners";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/ui/Reveal";

export function PartnersSection() {
  const { t } = useLanguage();
  return <section className="partners" id="partners"><Reveal><p className="section-kicker">{t.partners.kicker}</p><h2>{t.partners.title}</h2></Reveal><div className="partner-grid">{partners.map((partner) => <a href={partner.url} target="_blank" rel="noopener noreferrer" key={partner.name} aria-label={`${t.partners.visit} ${partner.name}`}><Image className={partner.className} src={partner.logo} alt={partner.name} width={230} height={100} /><span>{partner.name} ↗</span></a>)}</div></section>;
}
