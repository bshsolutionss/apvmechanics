"use client";

import { useEffect, useState } from "react";

export const TERMS_AND_CONDITIONS_COPY =
  "The $70 call-out fee covers travel to your location and an initial inspection. The fee applies whether or not you proceed with repairs. Additional charges may apply for further diagnosis, labour, repairs or parts. All additional work will be discussed before proceeding.";

export function TermsConditionsNote({ className = "" }: { className?: string }) {
  const [termsCopy, setTermsCopy] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.getItem("apv-terms-conditions") || TERMS_AND_CONDITIONS_COPY;
      } catch {}
    }
    return TERMS_AND_CONDITIONS_COPY;
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.termsConditions) {
          setTermsCopy(data.termsConditions);
          try {
            window.localStorage.setItem("apv-terms-conditions", data.termsConditions);
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={`terms-conditions-note ${className}`.trim()}>
      <p>
        <strong>Terms &amp; Conditions:</strong> {termsCopy}
      </p>
    </div>
  );
}
