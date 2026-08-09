import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { QuickServiceSelector } from "@/components/home/quick-service-selector";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutCompanySection, InnerVideo } from "@/components/inner/about-sections";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { MarqueeTicker } from "@/components/sections/marquee-ticker";
import { ProcessSection } from "@/components/sections/process-section";
import { FaqSection } from "@/components/sections/faq-section";
import { RentACarSection } from "@/components/home/rent-a-car-section";
import { GalleryLightbox } from "@/components/home/gallery-lightbox";
import { HomeContactSection } from "@/components/sections/home-contact-section";
import { TermsConditionsNote } from "@/components/common/terms-conditions-note";

export const metadata: Metadata = {
  title: "Mobile Mechanic Hobart | APV Mobile Mechanics",
  description:
    "Need a mechanic in Hobart? APV Mobile Mechanics comes to your home, office or roadside with expert repairs, servicing and diagnostics. Call 0424 411 375.",
  openGraph: {
    title: "Mobile Mechanic Hobart | APV Mobile Mechanics",
    description:
      "Need a mechanic in Hobart? APV Mobile Mechanics comes to your home, office or roadside with expert repairs, servicing and diagnostics. Call 0424 411 375.",
  },
};

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <QuickServiceSelector />
      <ServicesSection />
      <AboutCompanySection />
      <WhyChooseSection />
      <MarqueeTicker />
      <ProcessSection />
      <InnerVideo />
      <FaqSection />
      <RentACarSection />
      <GalleryLightbox />
      <section className="home-terms-section" id="terms" aria-labelledby="home-terms-title">
        <div className="container">
          <div className="home-terms-card">
            <div>
              <p className="home-terms-kicker">Before we begin</p>
              <h2 id="home-terms-title">Clear pricing from the start.</h2>
            </div>
            <TermsConditionsNote />
          </div>
        </div>
      </section>
      <HomeContactSection />
    </main>
  );
}
