import { Cpu, Gauge, Mail, MapPin, Phone, ShieldCheck, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { LocalContactForm } from "@/components/forms/contact-form";
import { EMAIL, GOOGLE_MAPS_URL, PHONE } from "@/constants";

const tools = [
  { icon: Cpu, label: "Digital Diagnostics", desc: "Advanced ECU & OBD2 scanner tools" },
  { icon: Wrench, label: "Precision Torque", desc: "Calibrated to manufacturer specs" },
  { icon: Gauge, label: "Pressure Testing", desc: "Hydraulic brake & cooling system tools" },
  { icon: ShieldCheck, label: "Mobile Battery Station", desc: "Pro battery load testing & charging" },
];

export function HomeContactSection() {
  return (
    <section className="section contact" id="contact">
      <div className="container split">
        <div className="contact__info">
          <SectionHeading eyebrow="CONTACT US" title={<>Connect With <em>Our Team</em></>} />
          <p>Book your repair or maintenance visit today. Our friendly specialists are equipped with professional diagnostic &amp; repair tools.</p>
          <div>
            <i><Phone /></i>
            <span>
              <small>Call Anytime</small>
              <b><a href={`tel:${PHONE.replace(/\s+/g, "")}`} style={{ color: "inherit" }}>{PHONE}</a></b>
            </span>
          </div>
          <div>
            <i><Mail /></i>
            <span>
              <small>Email Address</small>
              <b><a href={`mailto:${EMAIL}`} style={{ color: "inherit" }}>{EMAIL}</a></b>
            </span>
          </div>
          <div>
            <i><MapPin /></i>
            <span>
              <small>Get Directions</small>
              <b>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  We Come To You
                </a>
              </b>
            </span>
          </div>

          <div className="contact-tools-grid">
            <h4 className="contact-tools-heading">Mobile Tools &amp; Diagnostic Equipment</h4>
            <div className="contact-tools-items">
              {tools.map(({ icon: Icon, label, desc }) => (
                <div className="contact-tool-card" key={label}>
                  <div className="contact-tool-card__icon">
                    <Icon />
                  </div>
                  <div>
                    <b>{label}</b>
                    <small>{desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <LocalContactForm />
      </div>
    </section>
  );
}

export const HomeContact = HomeContactSection;
