"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/ui/Reveal";

export function EventExperienceSection() {
  const { t } = useLanguage();
  return <section className="experience" id="experience">
    <Reveal className="experience-copy"><p className="section-kicker">{t.experience.kicker}</p><h2>{t.experience.title}</h2><p>{t.experience.body}</p></Reveal>
    <div className="experience-list">{t.experience.items.map((item, i) => <Reveal key={item}><article><span>0{i + 1}</span><h3>{item}</h3><i aria-hidden="true" /></article></Reveal>)}</div>
  </section>;
}
