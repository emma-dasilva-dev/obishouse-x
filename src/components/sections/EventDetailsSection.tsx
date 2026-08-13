"use client";
import { eventFacts } from "@/data/event";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/ui/Reveal";

export function EventDetailsSection() {
  const { t } = useLanguage();
  return <section className="event-details" aria-label={t.details.title}>
    <div className="fact-grid">{eventFacts.map((fact) => <div className="fact" key={fact.key}><span>{t.facts[fact.key]}</span><strong>{fact.value}</strong></div>)}</div>
    <Reveal><div className="details-panel">
      <div><p className="section-kicker">{t.details.kicker}</p><h2>{t.details.title}</h2></div>
      <dl><div><dt>{t.details.dress}</dt><dd>{t.details.dressValue}</dd></div><div><dt>{t.details.entry}</dt><dd>{t.details.entryValue}</dd></div><div><dt>{t.details.policy}</dt><dd>{t.details.policyValue}</dd></div></dl>
    </div></Reveal>
  </section>;
}

