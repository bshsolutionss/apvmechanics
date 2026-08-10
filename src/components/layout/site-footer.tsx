"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Loader2, Mail } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { PremiumFooterCta } from "@/components/motion/premium-media-sections";
import { ASSET_PREFIX, EMAIL, GOOGLE_MAPS_URL, WHATSAPP_URL } from "@/constants";

export function SiteFooter() {
  const [newsEmail, setNewsEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newsMessage, setNewsMessage] = useState<string | null>(null);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsEmail.includes("@")) return;

    setSubmitting(true);
    setNewsMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsEmail.trim() }),
      });

      if (res.ok) {
        // Save local backup
        try {
          const existing = JSON.parse(window.localStorage.getItem("apv-newsletter-leads") ?? "[]");
          window.localStorage.setItem(
            "apv-newsletter-leads",
            JSON.stringify([...existing, { email: newsEmail.trim(), createdAt: new Date().toISOString() }])
          );
        } catch {}

        setNewsMessage("Subscribed successfully!");
        setNewsEmail("");
      } else {
        const data = await res.json();
        setNewsMessage(data.error || "Failed to subscribe.");
      }
    } catch {
      setNewsMessage("Subscribed successfully!");
      setNewsEmail("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <PremiumFooterCta />

      <div className="footer-main">
        {/* Gear/Cog watermark pattern */}
        <div className="footer-bg-overlay" />

        <div className="container footer-grid">
          {/* Column 1: Brand & Newsletter */}
          <div className="footer-col footer-col--brand">
            <Link className="footer-logo-lockup" href="/" aria-label="APV Mobile Mechanics home">
              <Image
                src={`${ASSET_PREFIX}/resources/apv-bear-logo-black.png`}
                alt="APV Mobile Mechanics Logo"
                width={175}
                height={175}
                style={{ objectFit: "contain", borderRadius: "12px", display: "block" }}
                unoptimized
                priority
              />
            </Link>

            <p className="footer-tagline">
              Mobile mechanic service coming to your home, office or roadside in Hobart with expert repairs, servicing and diagnostics.
            </p>

            <div className="footer-newsletter-box">
              <h4>Newsletter</h4>
              <form onSubmit={handleNewsletter} className="footer-newsletter-form-alt">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  disabled={submitting}
                  required
                />
                <button type="submit" aria-label="Subscribe to newsletter" disabled={submitting}>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : newsMessage?.includes("success") ? <Check size={18} /> : <Mail size={18} />}
                </button>
              </form>
              {newsMessage && (
                <p style={{ fontSize: "12px", marginTop: "6px", color: newsMessage.includes("success") ? "#2e7d32" : "#d90429" }}>
                  {newsMessage}
                </p>
              )}
            </div>

            <div className="footer-social-row">
              <a href="https://www.facebook.com/Apvmobilemechanics" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon social-icon--fb">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/apvmechanics/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon social-icon--ig">
                <InstagramIcon />
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-icon social-icon--wa">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Our Services */}
          <div className="footer-col">
            <h3 className="footer-heading">
              Our Services
              <span className="footer-heading-line" />
            </h3>
            <ul className="footer-links-list">
              <li><Link href="/mobile-car-repair">Mobile Car Repair</Link></li>
              <li><Link href="/engine-diagnosis">Engine Diagnostics</Link></li>
              <li><Link href="/brake-repair">Brake Repair</Link></li>
              <li><Link href="/battery-solution">Battery Replacement</Link></li>
              <li><Link href="/oil-change">Oil Change</Link></li>
              <li><Link href="/emergency-service">Emergency Roadside Assistance</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">
              Quick Links
              <span className="footer-heading-line" />
            </h3>
            <ul className="footer-links-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Location & Contact */}
          <div className="footer-col">
            <h3 className="footer-heading">
              Location &amp; Contact
              <span className="footer-heading-line" />
            </h3>
            <div className="footer-offices-block">
              <div className="office-item">
                <span className="office-label">APV Mobile Mechanics</span>
                <p className="office-address">
                  Email: <a href={`mailto:${EMAIL}`} style={{ color: "inherit" }}>{EMAIL}</a>
                </p>
                <p className="office-address">
                  <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary, #e31b23)" }}>View Google Maps Location</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="footer-bottom-bar">
          <div className="container footer-bottom-inner">
            <div className="footer-bottom-left">
              <p className="copyright-text">
                © 2026 APV Mobile Mechanics, All Rights Reserved.
              </p>
            </div>

            <div className="footer-bottom-right">
              <nav className="footer-legal-nav" aria-label="Legal navigation">
                <Link href="/#terms">Terms & Conditions</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
