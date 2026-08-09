"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronsRight, Clock3, Mail, Menu } from "lucide-react";
import { EMAIL, OPENING_HOURS } from "@/constants";

export interface TopbarProps {
  onOpenDrawer: () => void;
}

export function Topbar({ onOpenDrawer }: TopbarProps) {
  const [openingHours, setOpeningHours] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.getItem("apv-opening-hours") || OPENING_HOURS;
      } catch {}
    }
    return OPENING_HOURS;
  });

  useEffect(() => {
    // Fetch live settings asynchronously from API
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

  return (
    <div className="topbar">
      <div className="topbar__inner">
        <div className="topbar__item">
          <Mail />
          <span>
            <b>Email Address:</b>
            <small>{EMAIL}</small>
          </span>
        </div>
        <div className="topbar__item">
          <Clock3 />
          <span>
            <b>Opening Hours :</b>
            <small>{openingHours}</small>
          </span>
        </div>
        <div className="topbar__actions">
          <Link className="pill-button" href="/contact">
            <span>Book Now</span>
            <i>
              <ChevronsRight />
            </i>
          </Link>
          <button
            type="button"
            aria-label="Open information panel"
            className="topbar__menu-btn"
            onClick={onOpenDrawer}
          >
            <Menu />
          </button>
        </div>
      </div>
    </div>
  );
}
