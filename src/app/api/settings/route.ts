import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { OPENING_HOURS } from "@/config/site.config";
import { TERMS_AND_CONDITIONS_COPY } from "@/components/common/terms-conditions-note";

// In-memory store fallback
let currentOpeningHours = OPENING_HOURS;
let currentTermsConditions = TERMS_AND_CONDITIONS_COPY;

export async function GET() {
  let openingHours = currentOpeningHours;
  let termsConditions = currentTermsConditions;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["opening_hours", "terms_conditions"]);

      if (!error && data && data.length > 0) {
        data.forEach((row) => {
          if (row.key === "opening_hours" && row.value) {
            openingHours = row.value;
            currentOpeningHours = row.value;
          }
          if (row.key === "terms_conditions" && row.value) {
            termsConditions = row.value;
            currentTermsConditions = row.value;
          }
        });
      }
    } catch {}
  }

  return NextResponse.json({
    success: true,
    openingHours,
    termsConditions,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { openingHours, termsConditions } = body;

    const updates: { key: string; value: string }[] = [];

    if (openingHours && typeof openingHours === "string") {
      const cleanHours = openingHours.trim();
      currentOpeningHours = cleanHours;
      updates.push({ key: "opening_hours", value: cleanHours });
    }

    if (termsConditions && typeof termsConditions === "string") {
      const cleanTerms = termsConditions.trim();
      currentTermsConditions = cleanTerms;
      updates.push({ key: "terms_conditions", value: cleanTerms });
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No valid settings parameters provided for update." },
        { status: 400 }
      );
    }

    if (supabase && updates.length > 0) {
      try {
        await supabase
          .from("site_settings")
          .upsert(updates, { onConflict: "key" });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      openingHours: currentOpeningHours,
      termsConditions: currentTermsConditions,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update site settings." },
      { status: 500 }
    );
  }
}
