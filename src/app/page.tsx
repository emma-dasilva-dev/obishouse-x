import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { EventDetailsSection } from "@/components/sections/EventDetailsSection";
import { EventExperienceSection } from "@/components/sections/EventExperienceSection";
import { TicketSection } from "@/components/sections/TicketSection";
import { PartnersSection } from "@/components/sections/PartnersSection";

export default function Home() {
  return <><div id="top" /><Header /><main><HeroSection /><EventDetailsSection /><EventExperienceSection /><TicketSection /><PartnersSection /></main><Footer /></>;
}

