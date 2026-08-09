import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (supabase) {
      try {
        await supabase.from("newsletter_subscribers").insert([{ email: cleanEmail, status: "subscribed" }]);
      } catch {}
    }

    const newSubscriber = {
      id: "news_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      status: "subscribed" as const,
    };

    return NextResponse.json({ success: true, subscriber: newSubscriber });
  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing newsletter subscription." },
      { status: 500 }
    );
  }
}
