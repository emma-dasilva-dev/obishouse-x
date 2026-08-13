"use client";
import { useState, type FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/ui/Reveal";

export function TicketSection() {
  const { t } = useLanguage(); const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <section className="tickets" id="tickets"><Reveal><div className="ticket-card">
    <div className="ticket-copy"><p className="section-kicker">{t.tickets.kicker}</p><h2>{t.tickets.title}</h2><strong className="ticket-price">{t.tickets.price}</strong><p>{t.tickets.includes}</p><small>{t.tickets.rule}</small></div>
    <form onSubmit={submit}>{sent ? <p className="form-success" role="status">{t.tickets.success}</p> : <><label>{t.tickets.name}<input name="name" autoComplete="name" required /></label><label>{t.tickets.email}<input name="email" type="email" autoComplete="email" required /></label><button className="button primary" type="submit">{t.tickets.button}</button><small>{t.tickets.note}</small></>}</form>
    <span className="ticket-stub">CTN<br />ALL<br />STARS</span>
  </div></Reveal></section>;
}
