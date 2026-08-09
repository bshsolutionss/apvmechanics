import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { OPENING_HOURS } from "@/config/site.config";

// In-memory store fallback
let currentOpeningHours = OPENING_HOURS;

export async function GET() {
  let openingHours = currentOpeningHours;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "opening_hours")
        .single();

      if (!error && data?.value) {
        openingHours = data.value;
        currentOpeningHours = data.value;
      }
    } catch {}
  }

  return NextResponse.json({
    success: true,
    openingHours,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { openingHours } = body;

    if (!openingHours || typeof openingHours !== "string") {
      return NextResponse.json(
        { error: "Valid openingHours string is required." },
        { status: 400 }
      );
    }

    const cleanHours = openingHours.trim();
    currentOpeningHours = cleanHours;

    if (supabase) {
      try {
        await supabase
          .from("site_settings")
          .upsert([{ key: "opening_hours", value: cleanHours }], { onConflict: "key" });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      openingHours: cleanHours,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update site settings." },
      { status: 500 }
    );
  }
}
