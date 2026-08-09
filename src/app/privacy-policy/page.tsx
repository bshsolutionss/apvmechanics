import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, FileText, Eye, UserCheck, HardDrive, Phone, Mail, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import { PageBanner } from "@/components/common/page-banner";
import { ADDRESS, EMAIL, PHONE, SITE_NAME, SITE_URL } from "@/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | APV Mobile Mechanics Hobart",
  description:
    "Privacy Policy for APV Mobile Mechanics in Hobart, Tasmania. Learn how we collect, store, protect, and handle your personal information under the Privacy Act 1988 (Cth).",
  openGraph: {
    title: "Privacy Policy | APV Mobile Mechanics",
    description:
      "Privacy Policy for APV Mobile Mechanics in Hobart, Tasmania. Learn how we collect, store, protect, and handle your personal information.",
    url: `${SITE_URL}/privacy-policy`,
    type: "website",
  },
};

const SECTIONS = [
  { id: "overview", title: "1. Overview & Scope" },
  { id: "collection", title: "2. Personal Information We Collect" },
  { id: "how-collected", title: "3. How We Collect Data" },
  { id: "use-of-data", title: "4. How We Use Your Data" },
  { id: "disclosure", title: "5. Data Sharing & Disclosure" },
  { id: "security", title: "6. Security & Storage" },
  { id: "retention", title: "7. Retention & Destruction" },
  { id: "cookies", title: "8. Cookies & Web Analytics" },
  { id: "direct-marketing", title: "9. Marketing & Opt-Out" },
  { id: "your-rights", title: "10. Your Privacy Rights" },
  { id: "third-party", title: "11. Third-Party Links" },
  { id: "complaints", title: "12. Contact & Complaints (OAIC)" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="privacy-page">
      <PageBanner title="Privacy Policy" />

      <section className="section legal-section">
        <div className="container">
          {/* Header Notice Banner */}
          <div className="legal-notice-banner">
            <div className="legal-notice-banner__icon">
              <Shield size={28} />
            </div>
            <div className="legal-notice-banner__text">
              <h2>Your Privacy Is Paramount To APV Mobile Mechanics</h2>
              <p>
                This Privacy Policy sets out how <strong>{SITE_NAME}</strong> collects, holds, uses, and discloses your personal information in accordance with the <em>Australian Privacy Act 1988 (Cth)</em> and the <em>Australian Privacy Principles (APPs)</em>.
              </p>
              <div className="legal-meta-tags">
                <span className="legal-tag">Effective: 1 January 2026</span>
                <span className="legal-tag">Last Updated: August 2026</span>
                <span className="legal-tag">Jurisdiction: Tasmania, Australia</span>
              </div>
            </div>
          </div>

          <div className="legal-grid">
            {/* Left Sidebar Table of Contents */}
            <aside className="legal-sidebar">
              <div className="legal-toc-card">
                <h3 className="legal-toc-title">
                  <FileText size={18} /> Quick Navigation
                </h3>
                <nav className="legal-toc-nav" aria-label="Privacy Policy Sections">
                  <ul>
                    {SECTIONS.map((sec) => (
                      <li key={sec.id}>
                        <a href={`#${sec.id}`} className="legal-toc-link">
                          <ChevronRight size={14} /> {sec.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="legal-sidebar-contact">
                  <h4>Need Assistance?</h4>
                  <p>Have questions about your personal data?</p>
                  <a href={`mailto:${EMAIL}`} className="legal-contact-btn">
                    <Mail size={16} /> Email Privacy Officer
                  </a>
                  <a href={`tel:${PHONE.replace(/\s+/g, "")}`} className="legal-contact-btn legal-contact-btn--alt">
                    <Phone size={16} /> Call {PHONE}
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <article className="legal-content">
              {/* Section 1 */}
              <section id="overview" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">01</span>
                  <h2>1. Overview &amp; Scope</h2>
                </div>
                <p>
                  APV Mobile Mechanics (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a premier mobile auto repair and roadside service provider operating across Hobart and Southern Tasmania. We respect your right to privacy and are committed to maintaining the confidentiality and security of personal information collected through our website (<a href={SITE_URL}>{SITE_URL}</a>), phone bookings, online enquiry forms, WhatsApp messaging, and in-person mobile service appointments.
                </p>
                <p>
                  By accessing our website, booking a mobile repair, requesting a vehicle inspection, or providing information to our mechanics or staff, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.
                </p>
              </section>

              {/* Section 2 */}
              <section id="collection" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">02</span>
                  <h2>2. Personal Information We Collect</h2>
                </div>
                <p>
                  To deliver reliable mobile automotive repairs and customer service, we collect personal information that is reasonably necessary for our business functions. The types of personal information we collect include:
                </p>
                <div className="legal-info-cards">
                  <div className="legal-info-card">
                    <UserCheck className="legal-card-icon" />
                    <h3>Contact &amp; Identity Information</h3>
                    <p>Full name, phone number, email address, postal address, and service location address (home, office, or breakdown site in Hobart and surrounding areas).</p>
                  </div>
                  <div className="legal-info-card">
                    <HardDrive className="legal-card-icon" />
                    <h3>Vehicle &amp; Technical Data</h3>
                    <p>Vehicle Identification Number (VIN), vehicle make, model, manufacture year, registration number, engine type, mileage, diagnostic codes, and service history.</p>
                  </div>
                  <div className="legal-info-card">
                    <Lock className="legal-card-icon" />
                    <h3>Financial &amp; Payment Data</h3>
                    <p>Payment transaction records, invoices, and billing history. Credit card payments are processed securely through accredited PCI-DSS compliant payment processing platforms. APV Mobile Mechanics does not retain raw credit card details.</p>
                  </div>
                  <div className="legal-info-card">
                    <Eye className="legal-card-icon" />
                    <h3>Digital &amp; Usage Information</h3>
                    <p>IP address, browser type, device identifiers, geographic location data, operating system, referring URLs, pages visited, and interaction data collected via cookies and site performance tools.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="how-collected" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">03</span>
                  <h2>3. How We Collect Data</h2>
                </div>
                <p>We collect personal information directly from you through various channels, including:</p>
                <ul className="legal-list">
                  <li><strong>Website Forms:</strong> Completing repair booking requests, vehicle rental enquiries, contact forms, or newsletter subscriptions on our website.</li>
                  <li><strong>Phone &amp; Messaging:</strong> Calling our service team at <span>{PHONE}</span> or sending messages via WhatsApp, SMS, or email.</li>
                  <li><strong>In-Person Mobile Services:</strong> Providing vehicle details and authorization directly to our qualified mechanics at your vehicle&apos;s location.</li>
                  <li><strong>Automated Site Technologies:</strong> Passive collection via cookies, web beacons, and server logs when you browse our website.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="use-of-data" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">04</span>
                  <h2>4. How We Use Your Data</h2>
                </div>
                <p>We collect and use your personal information for the following primary purposes:</p>
                <div className="legal-purpose-grid">
                  <div className="purpose-item">
                    <h4>Service Fulfillment</h4>
                    <p>Dispatching mobile mechanics to your location, performing car repairs, engine diagnostics, brake replacements, oil changes, and roadside assistance.</p>
                  </div>
                  <div className="purpose-item">
                    <h4>Communication &amp; Scheduling</h4>
                    <p>Confirming appointment times, updating you on mechanic arrival ETAs, sharing repair quotes, diagnostic reports, and digital invoices.</p>
                  </div>
                  <div className="purpose-item">
                    <h4>Billing &amp; Warranty</h4>
                    <p>Processing service payments, issuing tax invoices, maintaining warranty records, and honoring service guarantees.</p>
                  </div>
                  <div className="purpose-item">
                    <h4>Customer Care &amp; Quality Control</h4>
                    <p>Responding to enquiries, measuring service satisfaction, training staff, and improving our mobile repair operations.</p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="disclosure" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">05</span>
                  <h2>5. Data Sharing &amp; Disclosure</h2>
                </div>
                <div className="legal-callout legal-callout--highlight">
                  <p><strong>Strict Anti-Spam Policy:</strong> APV Mobile Mechanics does not sell, rent, trade, or lease customer personal information to third-party advertisers or data brokers under any circumstances.</p>
                </div>
                <p>We may disclose your personal information only to trusted third parties in the following limited circumstances:</p>
                <ul className="legal-list">
                  <li><strong>Internal Staff &amp; Mobile Mechanics:</strong> Authorized employees and contractors who require information to fulfill your service request.</li>
                  <li><strong>Essential Service Partners:</strong> Specialized automotive parts suppliers, towing operators, or technical diagnostic software vendors required to complete repairs.</li>
                  <li><strong>IT &amp; Infrastructure Providers:</strong> Web hosting (Vercel), analytics services, payment gateway providers, and communication channels (email/SMS gateways).</li>
                  <li><strong>Legal Compliance:</strong> Government bodies, law enforcement agencies, or regulatory authorities when required by Australian law or court order.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="security" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">06</span>
                  <h2>6. Security &amp; Storage</h2>
                </div>
                <p>
                  We take reasonable physical, technical, and organizational safeguards to protect your personal information from unauthorized access, modification, disclosure, loss, or misuse.
                </p>
                <div className="security-badges-grid">
                  <div className="security-badge">
                    <Lock size={20} />
                    <span>SSL/TLS Encryption</span>
                  </div>
                  <div className="security-badge">
                    <Shield size={20} />
                    <span>Secure Access Control</span>
                  </div>
                  <div className="security-badge">
                    <HardDrive size={20} />
                    <span>Protected Cloud Servers</span>
                  </div>
                </div>
                <p>
                  All electronic data collected via our website is protected using industry-standard SSL (Secure Socket Layer) encryption. Access to customer records is restricted to authorized personnel who require the data for operational purposes.
                </p>
              </section>

              {/* Section 7 */}
              <section id="retention" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">07</span>
                  <h2>7. Retention &amp; Destruction</h2>
                </div>
                <p>
                  We retain personal information only for as long as necessary to satisfy the purposes for which it was collected, or as required by statutory Australian accounting, taxation, and legal compliance obligations (typically 7 years for financial records).
                </p>
                <p>
                  When personal information is no longer needed, we take secure measures to permanently destroy, delete, or de-identify the data.
                </p>
              </section>

              {/* Section 8 */}
              <section id="cookies" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">08</span>
                  <h2>8. Cookies &amp; Web Analytics</h2>
                </div>
                <p>
                  Our website uses cookies and similar tracking technologies to enhance user experience, remember session state, and monitor website traffic performance (e.g., Vercel Analytics).
                </p>
                <p>
                  Cookies are small files stored on your browser or device. You can configure your internet browser to decline or delete cookies at any time; however, disabling cookies may limit your ability to use certain features on our website.
                </p>
              </section>

              {/* Section 9 */}
              <section id="direct-marketing" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">09</span>
                  <h2>9. Direct Marketing &amp; Opt-Out</h2>
                </div>
                <p>
                  From time to time, we may send you service updates, vehicle maintenance reminders, or seasonal promotions. You may opt out of receiving promotional communications at any time by:
                </p>
                <ul className="legal-list">
                  <li>Clicking the &quot;Unsubscribe&quot; link in any marketing email.</li>
                  <li>Replying &quot;STOP&quot; to any SMS marketing broadcast.</li>
                  <li>Emailing your opt-out request directly to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</li>
                </ul>
                <p>
                  Please note that opting out of marketing messages does not affect essential operational communications regarding active service bookings or warranty notices.
                </p>
              </section>

              {/* Section 10 */}
              <section id="your-rights" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">10</span>
                  <h2>10. Your Privacy Rights (APP Compliance)</h2>
                </div>
                <p>
                  Under the <em>Australian Privacy Principles (APPs)</em>, you have rights regarding your personal information:
                </p>
                <div className="rights-cards">
                  <div className="rights-card">
                    <h4>Right of Access</h4>
                    <p>You have the right to request access to the personal information we hold about you.</p>
                  </div>
                  <div className="rights-card">
                    <h4>Right to Correction</h4>
                    <p>You have the right to request that inaccurate, out-of-date, or incomplete data be corrected.</p>
                  </div>
                </div>
                <p>
                  To exercise your rights, please submit a request in writing to our Privacy Officer at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We will respond to your request within 30 days without charging a fee for submitting the request.
                </p>
              </section>

              {/* Section 11 */}
              <section id="third-party" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">11</span>
                  <h2>11. Third-Party Links &amp; Platforms</h2>
                </div>
                <p>
                  Our website may contain links to external third-party services, including Google Maps, Instagram, Facebook, and WhatsApp. We do not control and are not responsible for the privacy practices, content, or security of external websites. We encourage you to read the privacy policies of any third-party platform you visit.
                </p>
              </section>

              {/* Section 12 */}
              <section id="complaints" className="legal-block">
                <div className="legal-block__header">
                  <span className="legal-block__num">12</span>
                  <h2>12. Contact &amp; Complaints (OAIC)</h2>
                </div>
                <p>
                  If you have questions about this Privacy Policy or wish to lodge a formal complaint regarding how your personal information has been handled, please contact our Privacy Officer:
                </p>

                <div className="legal-contact-card">
                  <div className="legal-contact-card__item">
                    <Shield className="legal-contact-icon" />
                    <div>
                      <strong>Business Name</strong>
                      <p>{SITE_NAME}</p>
                    </div>
                  </div>
                  <div className="legal-contact-card__item">
                    <MapPin className="legal-contact-icon" />
                    <div>
                      <strong>Address</strong>
                      <p>{ADDRESS}</p>
                    </div>
                  </div>
                  <div className="legal-contact-card__item">
                    <Phone className="legal-contact-icon" />
                    <div>
                      <strong>Phone</strong>
                      <p><a href={`tel:${PHONE.replace(/\s+/g, "")}`}>{PHONE}</a></p>
                    </div>
                  </div>
                  <div className="legal-contact-card__item">
                    <Mail className="legal-contact-icon" />
                    <div>
                      <strong>Email</strong>
                      <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
                    </div>
                  </div>
                </div>

                <div className="oaic-notice">
                  <h3>Lodging a Complaint with the Australian Information Commissioner</h3>
                  <p>
                    If you are dissatisfied with our response to your privacy complaint, you have the right to escalate your complaint to the <strong>Office of the Australian Information Commissioner (OAIC)</strong>:
                  </p>
                  <ul className="legal-list">
                    <li><strong>Website:</strong> <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">www.oaic.gov.au <ExternalLink size={12} /></a></li>
                    <li><strong>Phone:</strong> 1300 363 992</li>
                    <li><strong>Mail:</strong> GPO Box 5218, Sydney NSW 2001</li>
                  </ul>
                </div>
              </section>

              {/* Footer Return Link */}
              <div className="legal-footer-cta">
                <Link href="/" className="legal-back-btn">
                  &larr; Return to Home
                </Link>
                <Link href="/contact" className="legal-contact-link-btn">
                  Contact Us <ChevronRight size={16} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
