"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { EMAIL, GOOGLE_MAPS_URL, PHONE } from "@/constants";
import { InstagramIcon } from "@/components/icons";

export interface InfoDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function InfoDrawer({ open, onClose }: InfoDrawerProps) {
  return (
    <>
      <button
        className={`panel-overlay ${open ? "open" : ""}`}
        type="button"
        onClick={onClose}
        aria-label="Close information panel"
      />
      <aside className={`info-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <button
          type="button"
          className="info-drawer__close"
          onClick={onClose}
          aria-label="Close information panel"
        >
          <X />
        </button>
        <Image
          src="/assets/images/resources/apv-mobile-mechanics-logo.jpeg"
          alt="APV Mobile Mechanics"
          width={130}
          height={130}
          style={{ objectFit: "contain" }}
          unoptimized
        />
        <p>Professional automotive repair, diagnostics and mobile support delivered with dependable workmanship.</p>
        <h3>Contact Info</h3>
        <a href={`tel:${PHONE.replace(/\s+/g, "")}`}>
          <Phone />
          <span>
            Call Any Time<b>{PHONE}</b>
          </span>
        </a>
        <a href={`mailto:${EMAIL}`}>
          <Mail />
          <span>
            Email Address<b>{EMAIL}</b>
          </span>
        </a>
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
          <MapPin />
          <span>
            Get Directions<b>We Come To You</b>
          </span>
        </a>
        <div className="info-drawer__socials">
          <a href="https://www.facebook.com/Apvmobilemechanics" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <b>f</b>
          </a>
          <a
            href="https://www.instagram.com/apvmechanics/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
      </aside>
    </>
  );
}
