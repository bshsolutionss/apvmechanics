import Image from "next/image";
import { ArrowRight, Check, MapPin, Phone, Wrench } from "lucide-react";
import { ThemeButton } from "@/components/common/button";
import { SectionHeading } from "@/components/common/section-heading";
import { HomeTeam } from "@/components/home/showcase-carousels";
import { MarqueeTicker } from "@/components/sections/marquee-ticker";
import { ProcessSection } from "@/components/sections/process-section";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { ASSET_PREFIX, PHONE } from "@/constants";

export { MarqueeTicker as InnerMarquee };
export { ProcessSection };

export function AboutCompanySection() {
  return (
    <section className="about-one-clone inner-about" id="about">
      <div className="container about-clone-grid">
        <div className="about-clone-images" data-reveal>
          <span className="about-clone-vertical">ABOUT<br />COMPANY</span>
          <div className="about-clone-main">
            <Image
              src={`${ASSET_PREFIX}/generated/apv-about-workshop.webp`}
              alt="APV mobile mechanic repairing a vehicle"
              fill
              sizes="(max-width: 768px) 80vw, 488px"
            />
          </div>
          <div className="about-clone-small">
            <Image
              src={`${ASSET_PREFIX}/generated/apv-about-mechanic.webp`}
              alt="Professional APV mobile mechanic"
              fill
              sizes="(max-width: 768px) 48vw, 250px"
            />
          </div>
          <div className="about-clone-experience">
            <strong><span data-counter="10">10</span>+</strong>
            <b>Years Experience</b>
          </div>
        </div>
        <div className="about-clone-content" data-reveal>
          <SectionHeading eyebrow="ABOUT APV MOBILE MECHANICS" title={<>Hobart&apos;s Trusted<br />Mobile Car Repair</>} />
          <p>APV Mobile Mechanics started with a simple idea. Car owners should not have to take time off work, arrange transport or wait days for a workshop booking just to get a basic repair done. We built our business around bringing full workshop capability directly to driveways, offices and roadsides across Hobart.</p>
          <p>Over the past ten years we have grown from a single mobile unit into a name that Hobart drivers recognise and recommend, having serviced more than five hundred vehicles for families, tradespeople and small businesses who value straightforward advice and lasting repairs.</p>
          <div className="about-clone-features">
            <div><i><Wrench /></i><span><b>500+ Vehicles Serviced</b><small>Trusted by hundreds of<br />Hobart drivers.</small></span></div>
            <div><i><Check /></i><span><b>Fully Certified Mechanics</b><small>Expert care and<br />lasting repairs.</small></span></div>
          </div>
          <div className="about-clone-checks">
            {["Honesty first — we tell you what your car actually needs", "Fair pricing with no hidden call out charges", "Quality parts and workmanship backed by a clear warranty", "Respect for your time — we arrive when we say we will"].map(item => <span key={item}><Check />{item}</span>)}
          </div>
          <div className="about__bottom">
            <ThemeButton href="/contact">Contact Us</ThemeButton>
            <a className="about-clone-contact" href={`tel:${PHONE.replace(/\s+/g, "")}`}>
              <div className="about-clone-contact__icon">
                <Phone />
              </div>
              <span><small>Call Any Time</small><b>{PHONE}</b></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InnerVideo() {
  return null;
}

export function TeamSection() {
  return <HomeTeam inner />;
}

export function LocationsSection() {
  return (
    <section className="section locations-light">
      <div className="container">
        <SectionHeading eyebrow="OUR LOCATION" title={<>Connect With <em>APV Mobile Mechanics</em></>} center />
        <div className="location-light-wrapper">
          <div className="location-light-card">
            <div className="location-light-card__badge">01</div>
            <div className="location-light-card__info">
              <div className="location-light-card__icon">
                <MapPin />
              </div>
              <div>
                <h3>We Come To You</h3>
                <p>Mobile Service Delivered Direct To Your Location</p>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/dvreoSEMYhGPaky5A?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="location-light-card__btn"
              aria-label="Open Google Maps Location"
            >
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const cards = [
    { name: "Laura Brown", place: "New York, USA", imageIndex: 1 },
    { name: "William Foster", place: "Chicago, USA", imageIndex: 2 },
  ];
  return (
    <section className="section testimonials inner-testimonials">
      <div className="container">
        <SectionHeading eyebrow="OUR TESTIMONIALS" title={<>About Our Customers <em>Feedback Says</em></>} center />
        <div className="testimonial-grid">
          {cards.map(({ name, place, imageIndex }) => (
            <TestimonialCard
              key={name}
              name={name}
              place={place}
              imageIndex={imageIndex}
              text="“Excellent automotive care, clear communication and fast professional service. The whole team made the repair process simple.”"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
