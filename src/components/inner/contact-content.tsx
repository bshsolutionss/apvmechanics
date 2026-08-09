"use client";

import { useEffect, useState } from "react";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { LocalContactForm } from "@/components/forms/contact-form";
import { LocationCard } from "@/components/cards/location-card";
import { EMAIL, GOOGLE_MAPS_EMBED, GOOGLE_MAPS_URL, OPENING_HOURS, PHONE } from "@/constants";

export function ContactInfo() {
  const [openingHours, setOpeningHours] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.getItem("apv-opening-hours") || OPENING_HOURS;
      } catch {}
    }
    return OPENING_HOURS;
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.openingHours) {
          setOpeningHours(data.openingHours);
          try {
            window.localStorage.setItem("apv-opening-hours", data.openingHours);
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const items = [
    { icon: Phone, label: "Phone Number", value: PHONE, href: `tel:${PHONE.replace(/\s+/g, "")}` },
    { icon: Mail, label: "Email Address", value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: Clock3, label: "Opening Hours", value: openingHours, href: null },
    { icon: MapPin, label: "Get Directions", value: "We Come To You", href: GOOGLE_MAPS_URL },
  ];

  return (
    <section className="contact-info-section">
      <div className="container contact-info-grid">
        {items.map(({ icon, label, value, href }) => (
          <LocationCard
            key={label}
            icon={icon}
            label={label}
            value={value}
            href={href}
          />
        ))}
      </div>
    </section>
  );
}

export function ContactMapForm() {
  return (
    <>
      <section className="section contact-content-section">
        <div className="container">
          <p className="contact-intro">
            Whether you need a routine service, an urgent repair or just some honest advice about your car, APV Mobile Mechanics is ready to help. Reach us using the details below and we will arrange a visit that fits your schedule.
          </p>
          <div className="contact-details-grid">
            <div>
              <h2>How To Book</h2>
              <ol>
                <li>Call us or fill in the contact form with your details</li>
                <li>Tell us what is wrong with your car and where you are located</li>
                <li>Let us know your preferred day and time</li>
                <li>We confirm the booking and arrive ready to help</li>
              </ol>
              <h3>What To Tell Us When Booking</h3>
              <p>
                To help us prepare properly for your visit, let us know the make, model and year of your vehicle, a description of the issue you are experiencing and your preferred location, whether that is your home, workplace or another convenient spot.
              </p>
            </div>
            <div>
              <h2>Our Service Area</h2>
              <p>
                We service Hobart CBD and the surrounding suburbs, including Sandy Bay, Battery Point, West Hobart, South Hobart, New Town, Lenah Valley, Glenorchy, Moonah, Claremont, Rosny Park, Bellerive, Howrah, Lindisfarne, Kingston, Blackmans Bay and Mount Nelson.
              </p>
              <p className="contact-cta-text">
                Do not wait for a small issue to become a bigger one. Call APV Mobile Mechanics on <a href={`tel:${PHONE.replace(/\s+/g, "")}`}>{PHONE}</a> or send us your details today.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-page-section">
        <div className="container contact-page-grid">
          <div className="contact-map-wrapper">
            <iframe
              title="APV Mobile Mechanics location"
              src={GOOGLE_MAPS_EMBED}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <LocalContactForm />
        </div>
      </section>
    </>
  );
}
