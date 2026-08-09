"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { PremiumFooterCta } from "@/components/motion/premium-media-sections";
import { ASSET_PREFIX, EMAIL, GOOGLE_MAPS_URL, WHATSAPP_URL } from "@/constants";

export function SiteFooter() {
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
              Quality washes, reliable service every time. Your car deserves the shine we deliver.
            </p>

            <div className="footer-newsletter-box">
              <h4>Newsletter</h4>
              <form onSubmit={(e) => e.preventDefault()} className="footer-newsletter-form-alt">
                <input type="email" placeholder="Email Address" required />
                <button type="submit" aria-label="Subscribe to newsletter">
                  <Mail size={18} />
                </button>
              </form>
            </div>

            <div className="footer-social-row">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon social-icon--fb">
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
