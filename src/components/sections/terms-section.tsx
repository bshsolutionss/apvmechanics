"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Scale,
  Wrench,
  CreditCard,
  ShieldAlert,
  FileWarning,
  PhoneCall,
  Milestone,
  ArrowUpRight,
} from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { PHONE, EMAIL, SITE_NAME, SITE_URL } from "@/constants";

const TERMS = [
  {
    id: "acceptance",
    icon: Scale,
    title: "Acceptance of Terms",
    summary: "By using our services you agree to these terms.",
    body: `By accessing the ${SITE_NAME} website (${SITE_URL}) or booking any mobile automotive service with us — whether online, by phone, WhatsApp, or in person — you agree to be bound by these Terms of Service in full. If you do not agree with any part of these terms, please do not use our website or engage our services.`,
  },
  {
    id: "services",
    icon: Wrench,
    title: "Services Provided",
    summary: "Mobile mechanic repairs across Hobart & Southern Tasmania.",
    body: `${SITE_NAME} provides mobile automotive repair and maintenance services, including but not limited to: engine diagnostics, brake repair, battery replacement, oil changes, electrical repairs, vehicle inspections, and emergency roadside assistance. All services are delivered to your chosen location within the Greater Hobart service area, Monday to Friday, 8:00 AM – 5:00 PM. We reserve the right to decline any job we deem unsafe or outside our technical scope.`,
  },
  {
    id: "bookings",
    icon: Milestone,
    title: "Bookings & Cancellations",
    summary: "We ask for 24 hours notice to cancel or reschedule.",
    body: `Service appointments confirmed by our team are binding. If you need to cancel or reschedule, please notify us at least 24 hours in advance by calling ${PHONE} or emailing ${EMAIL}. Late cancellations or no-shows may incur a call-out fee at our discretion. We reserve the right to reschedule in the event of extreme weather, vehicle breakdown, or staffing emergencies, and will notify you as soon as possible.`,
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment & Pricing",
    summary: "Fair, upfront pricing with no hidden fees.",
    body: `All pricing is provided as a written quote or verbal estimate prior to work commencing. Payment is due in full upon completion of the service unless a prior arrangement has been made. We accept cash, bank transfer, and card payments. All prices are in Australian Dollars (AUD) and inclusive of GST where applicable. ${SITE_NAME} reserves the right to adjust pricing for parts at cost without additional markup beyond what is quoted.`,
  },
  {
    id: "warranty",
    icon: ShieldAlert,
    title: "Warranty on Repairs",
    summary: "All parts and labour are covered by our service warranty.",
    body: `Every repair and part fitted by ${SITE_NAME} is covered by a service warranty. Labour is warranted for 3 months or 5,000 km (whichever occurs first). Parts are covered for the duration of the manufacturer's warranty. This warranty is void if the vehicle is modified, tampered with, or serviced by another party after our work has been completed. Warranty claims must be reported to us promptly and we reserve the right to inspect the vehicle before any remedy is applied.`,
  },
  {
    id: "liability",
    icon: FileWarning,
    title: "Limitation of Liability",
    summary: "Our liability is limited to the value of services provided.",
    body: `To the maximum extent permitted by Australian consumer law, ${SITE_NAME}'s total liability in connection with any service or claim is limited to the value of the service provided. We are not liable for indirect, consequential, or incidental damages. Nothing in these terms limits your rights under the Australian Consumer Law (ACL), including rights regarding guarantees for services. If a service fails to meet a consumer guarantee, you are entitled to a remedy under the ACL.`,
  },
  {
    id: "contact",
    icon: PhoneCall,
    title: "Contact & Disputes",
    summary: "Reach out first — we resolve all issues directly and fairly.",
    body: `If you have a dispute regarding any service, please contact us first at ${EMAIL} or call ${PHONE}. We commit to responding to all complaints within 2 business days. If a resolution cannot be reached, disputes may be referred to Consumer Affairs Tasmania or the relevant Australian consumer authority. These Terms of Service are governed by the laws of Tasmania, Australia.`,
  },
];

function TermsAccordionItem({
  term,
  isOpen,
  onToggle,
}: {
  term: (typeof TERMS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const Icon = term.icon;

  return (
    <div className={`tos-item ${isOpen ? "tos-item--open" : ""}`}>
      <button
        className="tos-item__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`tos-body-${term.id}`}
        id={`tos-btn-${term.id}`}
      >
        <div className="tos-item__left">
          <span className="tos-item__icon-wrap">
            <Icon size={20} />
          </span>
          <div className="tos-item__meta">
            <span className="tos-item__title">{term.title}</span>
            <span className="tos-item__summary">{term.summary}</span>
          </div>
        </div>
        <span className="tos-item__chevron">
          <ChevronDown size={20} />
        </span>
      </button>
      <div
        id={`tos-body-${term.id}`}
        role="region"
        aria-labelledby={`tos-btn-${term.id}`}
        className="tos-item__body"
        ref={bodyRef}
        style={
          isOpen
            ? { maxHeight: bodyRef.current?.scrollHeight + "px" }
            : { maxHeight: "0px" }
        }
      >
        <div className="tos-item__body-inner">
          <p>{term.body}</p>
        </div>
      </div>
    </div>
  );
}

export function TermsOfServiceSection({ compact = false }: { compact?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={`tos-section ${compact ? "tos-section--compact" : ""}`} id="terms-of-service">
      {/* Dark header band */}
      <div className="tos-section__header">
        <div className="container">
          <div className="tos-section__header-inner">
            <SectionHeading
              eyebrow="TERMS OF SERVICE"
              title={<>Service Agreement &amp; <em>Your Rights</em></>}
              light
            />
            <p className="tos-section__intro">
              These Terms of Service govern your relationship with {SITE_NAME}.
              We believe in plain language — no legal jargon, just clear, fair conditions.
              Last updated: August 2026 &mdash; Effective for all services.
            </p>
            <div className="tos-meta-row">
              <span className="tos-meta-pill">Jurisdiction: Tasmania, AU</span>
              <span className="tos-meta-pill">Governed by: Australian Consumer Law</span>
              <span className="tos-meta-pill">Effective: 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion body */}
      <div className="tos-section__body">
        <div className="container">
          <div className="tos-accordion">
            {TERMS.map((term, i) => (
              <TermsAccordionItem
                key={term.id}
                term={term}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>

          {/* Bottom CTA row */}
          <div className="tos-cta-row">
            <div className="tos-cta-row__text">
              <strong>Questions about these terms?</strong>
              <span>Our team is available Monday–Friday, 8 AM to 5 PM.</span>
            </div>
            <div className="tos-cta-row__actions">
              <a href={`tel:${PHONE.replace(/\s+/g, "")}`} className="tos-cta-btn tos-cta-btn--red">
                <PhoneCall size={18} /> Call {PHONE}
              </a>
              <Link href="/contact" className="tos-cta-btn tos-cta-btn--outline">
                Contact Us <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
